"format register";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function dedupe(deps) {
    var newDeps = [];
    for (var i = 0, l = deps.length; i < l; i++)
      if (indexOf.call(newDeps, deps[i]) == -1)
        newDeps.push(deps[i])
    return newDeps;
  }

  function register(name, deps, declare, execute) {
    if (typeof name != 'string')
      throw "System.register provided no module name";
    
    var entry;

    // dynamic
    if (typeof declare == 'boolean') {
      entry = {
        declarative: false,
        deps: deps,
        execute: execute,
        executingRequire: declare
      };
    }
    else {
      // ES6 declarative
      entry = {
        declarative: true,
        deps: deps,
        declare: declare
      };
    }

    entry.name = name;
    
    // we never overwrite an existing define
    if (!defined[name])
      defined[name] = entry; 

    entry.deps = dedupe(entry.deps);

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }

  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      
      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;
      
      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {
        
        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;
      exports[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](exports);
        }
      }

      module.locked = false;
      return value;
    });
    
    module.setters = declaration.setters;
    module.execute = declaration.execute;

    if (!module.setters || !module.execute)
      throw new TypeError("Invalid System.register form for " + entry.name);

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = { 'default': depEntry.module.exports, __useDefault: true };
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);
    
      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);
    
    if (output)
      module.exports = output;
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    var module = entry.declarative ? entry.module.exports : { 'default': entry.module.exports, '__useDefault': true };

    // return the defined module object
    return modules[name] = module;
  };

  return function(main, declare) {

    var System;

    // if there's a system loader, define onto it
    if (typeof System != 'undefined' && System.register) {
      declare(System);
      System['import'](main);
    }
    // otherwise, self execute
    else {
      declare(System = {
        register: register, 
        get: load, 
        set: function(name, module) {
          modules[name] = module; 
        },
        newModule: function(module) {
          return module;
        },
        global: global 
      });
      System.set('@empty', System.newModule({}));
      load(main);
    }
  };

})(typeof window != 'undefined' ? window : global)
/* ('mainModule', function(System) {
  System.register(...);
}); */

('scripts/main', function(System) {




System.register("scripts/insert-email", [], function (_export) {
	"use strict";

	_export("insertEmail", insertEmail);

	function insertEmail(elements) {
		var host = window.location.hostname.replace("www.", ""),
		    href = "mai",
		    html = "and",
		    updateHref,
		    i;

		// Intentionally opaque
		href += String.fromCharCode(108) + "to" + String.fromCharCode(58) + html;
		href += "rew" + String.fromCharCode(64) + host;
		html += "rew";
		html += "&#64;" + host;
		// Finish href with encoded document title
		href += "?subject=" + encodeURI(document.title);

		updateHref = function () {
			this.href = href;
		};

		// Fill it in (with link on click)
		for (i = 0; i < elements.length; ++i) {
			elements[i].addEventListener("click", updateHref);
			elements[i].innerHTML = html;
		}
	}
	return {
		setters: [],
		execute: function () {}
	};
});
(function() {
function define(){};  define.amd = {};
System.register("scripts/util", [], false, function(require) {
  'use strict';
  var previousElementSibling = function(element) {
    if (element.previousElementSibling !== undefined) {
      return element.previousElementSibling;
    }
    do {
      element = element.previousSibling;
    } while (element && element.nodeType !== 1);
    return element;
  };
  return {previousElementSibling: previousElementSibling};
});


})();
System.register("scripts/image-parallax", [], function (_export) {
	"use strict";

	var image, image_wrap, parallax_speed, scrollY_previous, imageParallax, imageParallaxCalculate;


	// Return a function that initializes the effect
	_export("initImageParallax", initImageParallax);

	function initImageParallax(imageElement) {
		// Bail now if no support for pageYOffset
		if (window.pageYOffset === undefined || !imageElement) {
			return;
		}
		image = imageElement;
		// Kick off scrolling parallax image effects
		imageParallax();
		window.addEventListener("scroll", imageParallax);
		window.addEventListener("resize", imageParallaxCalculate);
	}
	return {
		setters: [],
		execute: function () {
			// Parallax effect (on scroll)
			parallax_speed = 0.3;


			// Initializes parallax and implements it on scroll
			// @uses imageParallaxCalculate
			imageParallax = function () {
				// Initialize
				if (image_wrap === undefined) {
					if (image === null || (image_wrap = image.parentElement) === null) {
						return false;
					}
					// Adding our calculations to window load doesn't work when command clicking a post link to open it in a new tab in Chrome
					// So instead, verify we have a usable image object and if not, use a timeout to check again in 150ms
					if (image.naturalWidth) {
						document.body.className += " is-loaded";
					} else {
						window.setTimeout(imageParallax, 150);
					}
					// Special case for svgs
					if (image.src.substring(image.src.length - 4) === ".svg") {
						image_wrap.className += " is-svg";
					}
					imageParallaxCalculate();
					scrollY_previous = window.pageYOffset;
				}

				// Don't do any work if:
				// 1. pageYOffset change is too small to matter
				// 2. post__splash image isn't cropped
				if (Math.abs(window.pageYOffset - scrollY_previous) * parallax_speed < 1.5 || image.clientHeight - 20 < image_wrap.clientHeight) {
					return;
				}
				// Cache pageYOffset
				scrollY_previous = window.pageYOffset;

				// Parallaxify
				image.style.bottom = Math.floor(scrollY_previous * parallax_speed * -1) + "px";
			};

			// Function to calculate dimensions and values for parallax
			imageParallaxCalculate = function () {
				if (image === null || image_wrap === null) {
					return;
				}
				// Make sure image is at least 15 pixels too tall to crop it
				if (image.clientHeight - 15 < image_wrap.clientHeight) {
					image_wrap.className = image_wrap.className.replace(/ is-cropped/g, "").replace(/ is-full-bleed/g, "");
					image_wrap.style.height = "";
					return;
				}

				// Calculations
				image_wrap.style.height = image_wrap.clientHeight + "px";
				image_wrap.className += " is-cropped";
				if (image.clientWidth < image_wrap.clientWidth) {
					image_wrap.style.width = image.clientWidth + "px";
				} else {
					// image_wrap.className += ' is-full-bleed';
					image_wrap.style.width = "";
					// If image is high-res (double resolution or thereabouts, set max-width at the smallest of clientHeight and full width * 0.5)
					if (image.naturalWidth > 2100 && image.naturalWidth / 2 < image_wrap.clientWidth) {
						image.style.maxWidth = image.naturalWidth / 2 + "px";
						image_wrap.style.width = image.naturalWidth / 2 + "px";
					} else {
						image.style.maxWidth = "";
						image_wrap.style.width = "";
					}
				}
			};
		}
	};
});
(function() {
function define(){};  define.amd = {};
System.register("scripts/polyfills", [], false, function(require) {
  'use strict';
  if (window.addEventListener === undefined) {
    window.Element.prototype.addEventListener = function(event_name, callback) {
      var self = this;
      self.attachEvent('on' + event_name, function(evt) {
        evt = evt || window.event;
        evt.preventDefault = evt.preventDefault || function() {
          evt.returnValue = false;
        };
        evt.stopPropagation = evt.stopPropagation || function() {
          evt.cancelBubble = true;
        };
        callback.call(self, evt);
      });
    };
  }
});


})();
System.register("scripts/image-comparison", ["scripts/util"], function (_export) {
	"use strict";

	var util, previousElementSibling, toggleImageComparison;
	_export("initImageComparison", initImageComparison);

	function initImageComparison() {
		var comparison_toggles = document.querySelectorAll(".image-comparison-toggle"),
		    comparison_image_wrap,
		    i;
		for (i = 0; i < comparison_toggles.length; i++) {
			comparison_image_wrap = previousElementSibling(comparison_toggles[i].parentElement);
			// If markup does not match what we expect, bail
			if (comparison_image_wrap === null) {
				continue;
			}
			// Set image comparison class
			comparison_image_wrap.className += " image-comparison-wrap";
			// Cache current content of toggle as 'data-text' attribute
			comparison_toggles[i].setAttribute("data-text", comparison_toggles[i].innerHTML);
			comparison_toggles[i].addEventListener("click", toggleImageComparison);
		}
	}
	return {
		setters: [function (_scriptsUtil) {
			util = _scriptsUtil["default"];
		}],
		execute: function () {
			previousElementSibling = util.previousElementSibling;
			toggleImageComparison = function () {
				var comparison_image_wrap = previousElementSibling(this.parentElement),
				    toggle_class = " is-toggled",
				    next_text;

				if (comparison_image_wrap === null) {
					return;
				}
				if (comparison_image_wrap.className.indexOf(toggle_class) > -1) {
					comparison_image_wrap.className = comparison_image_wrap.className.replace(toggle_class, "");
					next_text = this.getAttribute("data-text");
				} else {
					comparison_image_wrap.className += toggle_class;
					next_text = this.getAttribute("data-text-toggled");
				}
				if (next_text && next_text.length) {
					this.innerHTML = next_text;
				}
			};
		}
	};
});
System.register("scripts/main", ["scripts/insert-email", "scripts/image-comparison", "scripts/image-parallax", "scripts/polyfills"], function (_export) {
	"use strict";

	var insertEmail, initImageComparison, initImageParallax;
	return {
		setters: [function (_scriptsInsertEmail) {
			insertEmail = _scriptsInsertEmail.insertEmail;
		}, function (_scriptsImageComparison) {
			initImageComparison = _scriptsImageComparison.initImageComparison;
		}, function (_scriptsImageParallax) {
			initImageParallax = _scriptsImageParallax.initImageParallax;
		}, function (_scriptsPolyfills) {}],
		execute: function () {
			// Poor man's document ready (this is last thing on page, so should work fine)
			window.setTimeout(function () {
				"use strict";

				// Kick it all off
				insertEmail(document.querySelectorAll(".get-in-touch-link"));
				initImageComparison();
				initImageParallax(document.querySelector(".post__splash > img"));
			}, 1);
		}
	};
});

// Use ES6 imports


// Polyfills module returns nothing (just polyfills object prototypes where necessary)

});
//# sourceMappingURL=app-built.js.map