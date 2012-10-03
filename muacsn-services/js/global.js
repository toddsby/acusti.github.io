// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.8
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function(){var SelectParser;SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(child){return child.nodeName.toUpperCase()==="OPTGROUP"?this.add_group(child):this.add_option(child)},SelectParser.prototype.add_group=function(group){var group_position,option,_i,_len,_ref,_results;group_position=this.parsed.length,this.parsed.push({array_index:group_position,group:!0,label:group.label,children:0,disabled:group.disabled}),_ref=group.childNodes,_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++)option=_ref[_i],_results.push(this.add_option(option,group_position,group.disabled));return _results},SelectParser.prototype.add_option=function(option,group_position,group_disabled){if(option.nodeName.toUpperCase()==="OPTION")return option.text!==""?(group_position!=null&&(this.parsed[group_position].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:option.value,text:option.text,html:option.innerHTML,selected:option.selected,disabled:group_disabled===!0?group_disabled:option.disabled,group_array_index:group_position,classes:option.className,style:option.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1},SelectParser}(),SelectParser.select_to_array=function(select){var child,parser,_i,_len,_ref;parser=new SelectParser,_ref=select.childNodes;for(_i=0,_len=_ref.length;_i<_len;_i++)child=_ref[_i],parser.add_node(child);return parser.parsed},this.SelectParser=SelectParser}).call(this),function(){var AbstractChosen,root;root=this,AbstractChosen=function(){function AbstractChosen(form_field,options){this.form_field=form_field,this.options=options!=null?options:{},this.set_default_values(),this.is_multiple=this.form_field.multiple,this.set_default_text(),this.setup(),this.set_up_html(),this.register_observers(),this.finish_setup()}return AbstractChosen.prototype.set_default_values=function(){var _this=this;return this.click_test_action=function(evt){return _this.test_active_click(evt)},this.activate_action=function(evt){return _this.activate_field(evt)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.result_single_selected=null,this.allow_single_deselect=this.options.allow_single_deselect!=null&&this.form_field.options[0]!=null&&this.form_field.options[0].text===""?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.search_contains=this.options.search_contains||!1,this.choices=0,this.single_backstroke_delete=this.options.single_backstroke_delete||!1,this.max_selected_options=this.options.max_selected_options||Infinity},AbstractChosen.prototype.set_default_text=function(){return this.form_field.getAttribute("data-placeholder")?this.default_text=this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||"Select Some Options":this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||"Select an Option",this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||"No results match"},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(evt){var _this=this;if(!this.active_field)return setTimeout(function(){return _this.container_mousedown()},50)},AbstractChosen.prototype.input_blur=function(evt){var _this=this;if(!this.mouse_on_container)return this.active_field=!1,setTimeout(function(){return _this.blur_test()},100)},AbstractChosen.prototype.result_add_option=function(option){var classes,style;return option.disabled?"":(option.dom_id=this.container_id+"_o_"+option.array_index,classes=option.selected&&this.is_multiple?[]:["active-result"],option.selected&&classes.push("result-selected"),option.group_array_index!=null&&classes.push("group-option"),option.classes!==""&&classes.push(option.classes),style=option.style.cssText!==""?' style="'+option.style+'"':"",'<li id="'+option.dom_id+'" class="'+classes.join(" ")+'"'+style+">"+option.html+"</li>")},AbstractChosen.prototype.results_update_field=function(){return this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.result_single_selected=null,this.results_build()},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(evt){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.keyup_checker=function(evt){var stroke,_ref;stroke=(_ref=evt.which)!=null?_ref:evt.keyCode,this.search_field_scale();switch(stroke){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:evt.preventDefault();if(this.results_showing)return this.result_select(evt);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},AbstractChosen.prototype.generate_field_id=function(){var new_id;return new_id=this.generate_random_id(),this.form_field.id=new_id,new_id},AbstractChosen.prototype.generate_random_char=function(){var chars,newchar,rand;return chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",rand=Math.floor(Math.random()*chars.length),newchar=chars.substring(rand,rand+1)},AbstractChosen}(),root.AbstractChosen=AbstractChosen}.call(this),function(){var $,Chosen,get_side_border_padding,root,__hasProp=Object.prototype.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};root=this,$=jQuery,$.fn.extend({chosen:function(options){return $.browser.msie&&($.browser.version==="6.0"||$.browser.version==="7.0"&&document.documentMode===7)?this:this.each(function(input_field){var $this;$this=$(this);if(!$this.hasClass("chzn-done"))return $this.data("chosen",new Chosen(this,options))})}}),Chosen=function(_super){function Chosen(){Chosen.__super__.constructor.apply(this,arguments)}return __extends(Chosen,_super),Chosen.prototype.setup=function(){return this.form_field_jq=$(this.form_field),this.current_value=this.form_field_jq.val(),this.is_rtl=this.form_field_jq.hasClass("chzn-rtl")},Chosen.prototype.finish_setup=function(){return this.form_field_jq.addClass("chzn-done")},Chosen.prototype.set_up_html=function(){var container_div,dd_top,dd_width,sf_width;return this.container_id=this.form_field.id.length?this.form_field.id.replace(/[^\w]/g,"_"):this.generate_field_id(),this.container_id+="_chzn",this.f_width=this.form_field_jq.outerWidth(),container_div=$("<div />",{id:this.container_id,"class":"chzn-container"+(this.is_rtl?" chzn-rtl":""),style:"width: "+this.f_width+"px;"}),this.is_multiple?container_div.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>'):container_div.html('<a href="javascript:void(0)" class="chzn-single chzn-default"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>'),this.form_field_jq.hide().after(container_div),this.container=$("#"+this.container_id),this.container.addClass("chzn-container-"+(this.is_multiple?"multi":"single")),this.dropdown=this.container.find("div.chzn-drop").first(),dd_top=this.container.height(),dd_width=this.f_width-get_side_border_padding(this.dropdown),this.dropdown.css({width:dd_width+"px",top:dd_top+"px"}),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chzn-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chzn-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chzn-search").first(),this.selected_item=this.container.find(".chzn-single").first(),sf_width=dd_width-get_side_border_padding(this.search_container)-get_side_border_padding(this.search_field),this.search_field.css({width:sf_width+"px"})),this.results_build(),this.set_tab_index(),this.form_field_jq.trigger("liszt:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var _this=this;return this.container.mousedown(function(evt){return _this.container_mousedown(evt)}),this.container.mouseup(function(evt){return _this.container_mouseup(evt)}),this.container.mouseenter(function(evt){return _this.mouse_enter(evt)}),this.container.mouseleave(function(evt){return _this.mouse_leave(evt)}),this.search_results.mouseup(function(evt){return _this.search_results_mouseup(evt)}),this.search_results.mouseover(function(evt){return _this.search_results_mouseover(evt)}),this.search_results.mouseout(function(evt){return _this.search_results_mouseout(evt)}),this.form_field_jq.bind("liszt:updated",function(evt){return _this.results_update_field(evt)}),this.form_field_jq.bind("liszt:activate",function(evt){return _this.activate_field(evt)}),this.form_field_jq.bind("liszt:open",function(evt){return _this.container_mousedown(evt)}),this.search_field.blur(function(evt){return _this.input_blur(evt)}),this.search_field.keyup(function(evt){return _this.keyup_checker(evt)}),this.search_field.keydown(function(evt){return _this.keydown_checker(evt)}),this.is_multiple?(this.search_choices.click(function(evt){return _this.choices_click(evt)}),this.search_field.focus(function(evt){return _this.input_focus(evt)})):this.container.click(function(evt){return evt.preventDefault()})},Chosen.prototype.search_field_disabled=function(){this.is_disabled=this.form_field_jq[0].disabled;if(this.is_disabled)return this.container.addClass("chzn-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus",this.activate_action),this.close_field();this.container.removeClass("chzn-disabled"),this.search_field[0].disabled=!1;if(!this.is_multiple)return this.selected_item.bind("focus",this.activate_action)},Chosen.prototype.container_mousedown=function(evt){var target_closelink;if(!this.is_disabled)return target_closelink=evt!=null?$(evt.target).hasClass("search-choice-close"):!1,evt&&evt.type==="mousedown"&&!this.results_showing&&evt.stopPropagation(),!this.pending_destroy_click&&!target_closelink?(this.active_field?!this.is_multiple&&evt&&($(evt.target)[0]===this.selected_item[0]||$(evt.target).parents("a.chzn-single").length)&&(evt.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),$(document).click(this.click_test_action),this.results_show()),this.activate_field()):this.pending_destroy_click=!1},Chosen.prototype.container_mouseup=function(evt){if(evt.target.nodeName==="ABBR"&&!this.is_disabled)return this.results_reset(evt)},Chosen.prototype.blur_test=function(evt){if(!this.active_field&&this.container.hasClass("chzn-container-active"))return this.close_field()},Chosen.prototype.close_field=function(){return $(document).unbind("click",this.click_test_action),this.is_multiple||(this.selected_item.attr("tabindex",this.search_field.attr("tabindex")),this.search_field.attr("tabindex",-1)),this.active_field=!1,this.results_hide(),this.container.removeClass("chzn-container-active"),this.winnow_results_clear(),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return!this.is_multiple&&!this.active_field&&(this.search_field.attr("tabindex",this.selected_item.attr("tabindex")),this.selected_item.attr("tabindex",-1)),this.container.addClass("chzn-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(evt){return $(evt.target).parents("#"+this.container_id).length?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){var content,data,_i,_len,_ref;this.parsing=!0,this.results_data=root.SelectParser.select_to_array(this.form_field),this.is_multiple&&this.choices>0?(this.search_choices.find("li.search-choice").remove(),this.choices=0):this.is_multiple||(this.selected_item.addClass("chzn-default").find("span").text(this.default_text),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?this.container.addClass("chzn-container-single-nosearch"):this.container.removeClass("chzn-container-single-nosearch")),content="",_ref=this.results_data;for(_i=0,_len=_ref.length;_i<_len;_i++)data=_ref[_i],data.group?content+=this.result_add_group(data):data.empty||(content+=this.result_add_option(data),data.selected&&this.is_multiple?this.choice_build(data):data.selected&&!this.is_multiple&&(this.selected_item.removeClass("chzn-default").find("span").text(data.text),this.allow_single_deselect&&this.single_deselect_control_build()));return this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.search_results.html(content),this.parsing=!1},Chosen.prototype.result_add_group=function(group){return group.disabled?"":(group.dom_id=this.container_id+"_g_"+group.array_index,'<li id="'+group.dom_id+'" class="group-result">'+$("<div />").text(group.label).html()+"</li>")},Chosen.prototype.result_do_highlight=function(el){var high_bottom,high_top,maxHeight,visible_bottom,visible_top;if(el.length){this.result_clear_highlight(),this.result_highlight=el,this.result_highlight.addClass("highlighted"),maxHeight=parseInt(this.search_results.css("maxHeight"),10),visible_top=this.search_results.scrollTop(),visible_bottom=maxHeight+visible_top,high_top=this.result_highlight.position().top+this.search_results.scrollTop(),high_bottom=high_top+this.result_highlight.outerHeight();if(high_bottom>=visible_bottom)return this.search_results.scrollTop(high_bottom-maxHeight>0?high_bottom-maxHeight:0);if(high_top<visible_top)return this.search_results.scrollTop(high_top)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){var dd_top;if(!this.is_multiple)this.selected_item.addClass("chzn-single-with-drop"),this.result_single_selected&&this.result_do_highlight(this.result_single_selected);else if(this.max_selected_options<=this.choices)return this.form_field_jq.trigger("liszt:maxselected",{chosen:this}),!1;return dd_top=this.is_multiple?this.container.height():this.container.height()-1,this.form_field_jq.trigger("liszt:showing_dropdown",{chosen:this}),this.dropdown.css({top:dd_top+"px",left:0}),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results()},Chosen.prototype.results_hide=function(){return this.is_multiple||this.selected_item.removeClass("chzn-single-with-drop"),this.result_clear_highlight(),this.form_field_jq.trigger("liszt:hiding_dropdown",{chosen:this}),this.dropdown.css({left:"-9000px"}),this.results_showing=!1},Chosen.prototype.set_tab_index=function(el){var ti;if(this.form_field_jq.attr("tabindex"))return ti=this.form_field_jq.attr("tabindex"),this.form_field_jq.attr("tabindex",-1),this.is_multiple?this.search_field.attr("tabindex",ti):(this.selected_item.attr("tabindex",ti),this.search_field.attr("tabindex",-1))},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(evt){var target;target=$(evt.target).hasClass("active-result")?$(evt.target):$(evt.target).parents(".active-result").first();if(target.length)return this.result_highlight=target,this.result_select(evt)},Chosen.prototype.search_results_mouseover=function(evt){var target;target=$(evt.target).hasClass("active-result")?$(evt.target):$(evt.target).parents(".active-result").first();if(target)return this.result_do_highlight(target)},Chosen.prototype.search_results_mouseout=function(evt){if($(evt.target).hasClass("active-result"))return this.result_clear_highlight()},Chosen.prototype.choices_click=function(evt){evt.preventDefault();if(this.active_field&&!$(evt.target).hasClass("search-choice")&&!this.results_showing)return this.results_show()},Chosen.prototype.choice_build=function(item){var choice_id,html,link,_this=this;return this.is_multiple&&this.max_selected_options<=this.choices?(this.form_field_jq.trigger("liszt:maxselected",{chosen:this}),!1):(choice_id=this.container_id+"_c_"+item.array_index,this.choices+=1,item.disabled?html='<li class="search-choice search-choice-disabled" id="'+choice_id+'"><span>'+item.html+"</span></li>":html='<li class="search-choice" id="'+choice_id+'"><span>'+item.html+'</span><a href="javascript:void(0)" class="search-choice-close" rel="'+item.array_index+'"></a></li>',this.search_container.before(html),link=$("#"+choice_id).find("a").first(),link.click(function(evt){return _this.choice_destroy_link_click(evt)}))},Chosen.prototype.choice_destroy_link_click=function(evt){return evt.preventDefault(),this.is_disabled?evt.stopPropagation:(this.pending_destroy_click=!0,this.choice_destroy($(evt.target)))},Chosen.prototype.choice_destroy=function(link){if(this.result_deselect(link.attr("rel")))return this.choices-=1,this.show_search_field_default(),this.is_multiple&&this.choices>0&&this.search_field.val().length<1&&this.results_hide(),link.parents("li").first().remove()},Chosen.prototype.results_reset=function(){this.form_field.options[0].selected=!0,this.selected_item.find("span").text(this.default_text),this.is_multiple||this.selected_item.addClass("chzn-default"),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change");if(this.active_field)return this.results_hide()},Chosen.prototype.results_reset_cleanup=function(){return this.current_value=this.form_field_jq.val(),this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(evt){var high,high_id,item,position;if(this.result_highlight)return high=this.result_highlight,high_id=high.attr("id"),this.result_clear_highlight(),this.is_multiple?this.result_deactivate(high):(this.search_results.find(".result-selected").removeClass("result-selected"),this.result_single_selected=high,this.selected_item.removeClass("chzn-default")),high.addClass("result-selected"),position=high_id.substr(high_id.lastIndexOf("_")+1),item=this.results_data[position],item.selected=!0,this.form_field.options[item.options_index].selected=!0,this.is_multiple?this.choice_build(item):(this.selected_item.find("span").first().text(item.text),this.allow_single_deselect&&this.single_deselect_control_build()),(!evt.metaKey||!this.is_multiple)&&this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field_jq.val()!==this.current_value)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[item.options_index].value}),this.current_value=this.form_field_jq.val(),this.search_field_scale()},Chosen.prototype.result_activate=function(el){return el.addClass("active-result")},Chosen.prototype.result_deactivate=function(el){return el.removeClass("active-result")},Chosen.prototype.result_deselect=function(pos){var result,result_data;return result_data=this.results_data[pos],this.form_field.options[result_data.options_index].disabled?!1:(result_data.selected=!1,this.form_field.options[result_data.options_index].selected=!1,result=$("#"+this.container_id+"_o_"+pos),result.removeClass("result-selected").addClass("active-result").show(),this.result_clear_highlight(),this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[result_data.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){if(this.allow_single_deselect&&this.selected_item.find("abbr").length<1)return this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>')},Chosen.prototype.winnow_results=function(){var found,option,part,parts,regex,regexAnchor,result,result_id,results,searchText,startpos,text,zregex,_i,_j,_len,_len2,_ref;this.no_results_clear(),results=0,searchText=this.search_field.val()===this.default_text?"":$("<div/>").text($.trim(this.search_field.val())).html(),regexAnchor=this.search_contains?"":"^",regex=new RegExp(regexAnchor+searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i"),zregex=new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i"),_ref=this.results_data;for(_i=0,_len=_ref.length;_i<_len;_i++){option=_ref[_i];if(!option.disabled&&!option.empty)if(option.group)$("#"+option.dom_id).css("display","none");else if(!this.is_multiple||!option.selected){found=!1,result_id=option.dom_id,result=$("#"+result_id);if(regex.test(option.html))found=!0,results+=1;else if(option.html.indexOf(" ")>=0||option.html.indexOf("[")===0){parts=option.html.replace(/\[|\]/g,"").split(" ");if(parts.length)for(_j=0,_len2=parts.length;_j<_len2;_j++)part=parts[_j],regex.test(part)&&(found=!0,results+=1)}found?(searchText.length?(startpos=option.html.search(zregex),text=option.html.substr(0,startpos+searchText.length)+"</em>"+option.html.substr(startpos+searchText.length),text=text.substr(0,startpos)+"<em>"+text.substr(startpos)):text=option.html,result.html(text),this.result_activate(result),option.group_array_index!=null&&$("#"+this.results_data[option.group_array_index].dom_id).css("display","list-item")):(this.result_highlight&&result_id===this.result_highlight.attr("id")&&this.result_clear_highlight(),this.result_deactivate(result))}}return results<1&&searchText.length?this.no_results(searchText):this.winnow_results_set_highlight()},Chosen.prototype.winnow_results_clear=function(){var li,lis,_i,_len,_results;this.search_field.val(""),lis=this.search_results.find("li"),_results=[];for(_i=0,_len=lis.length;_i<_len;_i++)li=lis[_i],li=$(li),li.hasClass("group-result")?_results.push(li.css("display","auto")):!this.is_multiple||!li.hasClass("result-selected")?_results.push(this.result_activate(li)):_results.push(void 0);return _results},Chosen.prototype.winnow_results_set_highlight=function(){var do_high,selected_results;if(!this.result_highlight){selected_results=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),do_high=selected_results.length?selected_results.first():this.search_results.find(".active-result").first();if(do_high!=null)return this.result_do_highlight(do_high)}},Chosen.prototype.no_results=function(terms){var no_results_html;return no_results_html=$('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),no_results_html.find("span").first().html(terms),this.search_results.append(no_results_html)},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var first_active,next_sib;this.result_highlight?this.results_showing&&(next_sib=this.result_highlight.nextAll("li.active-result").first(),next_sib&&this.result_do_highlight(next_sib)):(first_active=this.search_results.find("li.active-result").first(),first_active&&this.result_do_highlight($(first_active)));if(!this.results_showing)return this.results_show()},Chosen.prototype.keyup_arrow=function(){var prev_sibs;if(!this.results_showing&&!this.is_multiple)return this.results_show();if(this.result_highlight)return prev_sibs=this.result_highlight.prevAll("li.active-result"),prev_sibs.length?this.result_do_highlight(prev_sibs.first()):(this.choices>0&&this.results_hide(),this.result_clear_highlight())},Chosen.prototype.keydown_backstroke=function(){var next_available_destroy;if(this.pending_backstroke)return this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke();next_available_destroy=this.search_container.siblings("li.search-choice").last();if(next_available_destroy.length&&!next_available_destroy.hasClass("search-choice-disabled"))return this.pending_backstroke=next_available_destroy,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(evt){var stroke,_ref;stroke=(_ref=evt.which)!=null?_ref:evt.keyCode,this.search_field_scale(),stroke!==8&&this.pending_backstroke&&this.clear_backstroke();switch(stroke){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(evt),this.mouse_on_container=!1;break;case 13:evt.preventDefault();break;case 38:evt.preventDefault(),this.keyup_arrow();break;case 40:this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var dd_top,div,h,style,style_block,styles,w,_i,_len;if(this.is_multiple){h=0,w=0,style_block="position:absolute; left: -1000px; top: -1000px; display:none;",styles=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"];for(_i=0,_len=styles.length;_i<_len;_i++)style=styles[_i],style_block+=style+":"+this.search_field.css(style)+";";return div=$("<div />",{style:style_block}),div.text(this.search_field.val()),$("body").append(div),w=div.width()+25,div.remove(),w>this.f_width-10&&(w=this.f_width-10),this.search_field.css({width:w+"px"}),dd_top=this.container.height(),this.dropdown.css({top:dd_top+"px"})}},Chosen.prototype.generate_random_id=function(){var string;string="sel"+this.generate_random_char()+this.generate_random_char()+this.generate_random_char();while($("#"+string).length>0)string+=this.generate_random_char();return string},Chosen}(AbstractChosen),get_side_border_padding=function(elmt){var side_border_padding;return side_border_padding=elmt.outerWidth()-elmt.width()},root.get_side_border_padding=get_side_border_padding}.call(this);


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


/*
 * Title Caps
 * 
 * Modified from JavaScript port by John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */
(function(){
	var small = '(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)';
	var punct = '([!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)';
	this.titleCaps = function(title){
		var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
		title = lower(title); // start all lowercase
		while (true) {
			var m = split.exec(title);
			parts.push(title.substring(index, m ? m.index : title.length)
				.replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
					return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
				})
				.replace(RegExp('\\b' + small + '\\b', 'ig'), lower)
				.replace(RegExp('^' + punct + small + '\\b', 'ig'), function(all, punct, word){
					return punct + upper(word);
				})
				.replace(RegExp('\\b' + small + punct + '$', 'ig'), upper));
			index = split.lastIndex;
			if ( m ) parts.push( m[0] );
			else break;
		}
		return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ')
			.replace(/(['Õ])S\b/ig, '$1s')
			.replace(/\b(AT&T|Q&A)\b/ig, function(all){
				return all.toUpperCase();
			})
			.replace(/&[a-z][0-9a-z]+;/ig, lower);
	};
	function lower(word){
		return word.toLowerCase();
	}
	function upper(word){
	  return word.substr(0,1).toUpperCase() + word.substr(1);
	}
})();


/**
 * Custom helper object
 */
var _s = {
	url: 'https://docs.google.com/spreadsheet/pub?key=0Ai7_HGlX7EcWdHdNaWNCU1BHWTQ4c2VWeWtYZ29OZmc&single=true',
	spreadsheet: new GoogleSpreadsheet(),
	data: [],
	column_titles: ['nom', 'langue', 'reference', 'population', 'arrondissement'],
	// Add an array of values for detailed info presentation?
	column_ids: [],
	columns: {}, // let's try columns like this: columns[col_id] = title;
	detail_ids: [],
	detail_titles: {},
	details: [],
	$service_expanded: [],
	$result_table: '',
	$results: $('#results'),
	$details: $('#details'),
	log: function(message) {
		if (window.console)
			console.log(message);
	},
	shrink_results: function() {
		
	},
	hide_results: function() {
		
	},
	remove_results: function() {
		_s.shrink_results();
		
		var target_h = 300;
		var outer_h = _s.$results.outerHeight();
		if (outer_h > ($form.height() - 10)) {
			_s.$results.css('height', document.documentElement.clientHeight);
		} else {
			_s.$results.css({height: _s.$results.height() + 'px', minHeight: 0});
		}
	
		_s.$results.animate({height: target_h}, 500, function() {
			_s.$results.animate({marginLeft: '-'+$('#results-wrap').outerWidth()+'px'}, 300, function() {
				_s.$results.trigger('results.removed');
			});
		});
		
		_s.$results.find('.note, table').remove();
	},
	toggle_details: function($service, details_html) {
		// First check for open details
		if (_s.$service_expanded.length) {
			_s.$service_expanded.animate({height: '-=' + _s.$details.outerHeight()}, 200).removeClass('expanded');
			_s.$details.slideUp(200, function() {
				// First, check if it isn't the just clicked service
				var is_same_service = _s.$service_expanded[0] === $service[0];
				// Clean up closed service element
				_s.$service_expanded.stop(true, true).css('height', '');
				// Remove element from 'cache'
				_s.$service_expanded = [];
				// Clean up details element
			 	_s.$details.removeAttr('style');

				if (!is_same_service)
					_s.show_details($service, details_html);
			});

		} else {
			_s.show_details($service, details_html);
		}
	},
	show_details: function($service, details_html) {
		_s.$details.html(details_html);
		var details_height = _s.$details.outerHeight();
		_s.$details.css({
			top: $service.position().top + $service.outerHeight(),
			display: 'none'
		}).slideDown(200);
		$service.animate({height: '+=' + details_height}, 200, function() {
			_s.$service_expanded = $service;
		}).addClass('expanded');
	}
};

// Create services table on spreadsheet load
// For offline testing and use, set spreadsheet data as array above, commented out next 2 lines, added a document.ready line
_s.spreadsheet.url(_s.url);
_s.spreadsheet.load(function(result) {
	_s.data = result.data;
	var num_cells = _s.data.length;
	//if (num_cells % num_col !== 0) {
	//}
	var cell = [];
	
	// Figure out what columns we need to display: organization name, health issue (“section”), neighborhood, language (“Language of service”), reference needed (“reference needed?”)

	// figure out number of columns and set up _s.column_ids and _s.columns
	for (var i = 0, name_key, name; i < num_cells; i++) {
		if (!_s.data[i].length)
			continue;
		
		name_key = _s.data[i][1].split('/')[0].split(' ')[0].toLowerCase().replace(/é/g, 'e');
		// don't start counting until we find the proper beginning
		if (!cell.length && name_key != _s.column_titles[0]) {
			_s.data[i] = [];
			continue;
		}
		
		if (cell.length) {
			// if the previous cell has a larger ASCII value than the current one, we have finished the first row
			if (cell[0].charCodeAt() >= _s.data[i][0].charCodeAt())
				break;
			//_s.log(_s.data[i]);
		}
		cell = _s.data[i];
		
		name = cell[1].split('\n');
		// If there is a new line in the title, then there are actually multiple titles
		for (var ii = 0; ii < name.length; ii++) {
			if (name[ii].indexOf('/') > 0)
				name[ii] = name[ii].replace('/', '&nbsp;/ <i>') + '</i>';
		}
		name = name.join(' ');

		if (_s.column_titles.indexOf(name_key) > -1) {
			// Process column titles
			_s.columns[cell[0].charAt()] = name;
			_s.column_ids.push(cell[0].charAt());
			// set up search-control column association (identifier will be lowercase 1st (or only) word of cell value
			// using $.fn.data() instead of the faster $.data() because it isn't worth looping through the collection to get DOM elements
			$('#'+name_key).add('input[name="'+name_key+'"]').data('column', cell[0].charAt());
		} else {
			// Process detail info categories
			_s.detail_titles[cell[0].charAt()] = name;
			_s.detail_ids.push(cell[0].charAt());
		}
	}
	if (!cell.length)
		return false;
	
	var num_cols = cell[0].charCodeAt() - 'A'.charCodeAt() + 1;
	//$('#results').html('number of columns: '+num_cols+'<br>number of cells:'+num_cells);

	var table = '<table id="master">',
		first_row = true,
		row_idx = 0,
		col_idx = _s.column_ids.length - 1,
		this_row_idx, this_col_idx, td_class, row_number;
	for (var i = 0; i < num_cells; i++) {
		if (!_s.data[i].length)
			continue;
		
		td_class = _s.data[i][0].charAt();
		row_number = _s.data[i][0].substr(1);
		if (typeof _s.columns[td_class] == 'undefined') {
			if (!first_row) {
				// Initialize service entry if necessary
				if (typeof _s.details[row_number] == 'undefined')
					_s.details[row_number] = {};
				
				// Fill in details
				_s.details[row_number][td_class] = _s.data[i][1];
			}
			continue;
		}
		
		if (first_row) {
			this_row_idx = _s.data[i][0].charCodeAt();
			if (row_idx >= this_row_idx) {
				first_row = false;
			} else {
				table += '<th class="' + td_class + '-head">' + _s.columns[td_class] + '</th>';
				row_idx = this_row_idx;
				continue;
			}
		}
		
		// If we skipped empty cells, this loop will fill them in
		this_col_idx = _s.column_ids.indexOf(td_class);
		if (this_col_idx != (col_idx+1)) {
			// Figure out if we need to fill in
			if (this_col_idx > 0 || col_idx < (_s.column_ids.length - 1)) {
				var max = this_col_idx > 0 ? this_col_idx : _s.column_ids.length;
				for (col_idx++; col_idx < max; col_idx++) {
					table += '<td class="' + _s.column_ids[col_idx] + '"></td>';
				}
			}
		}
		
		// Check if this td_class index === indexOf(cell[0].charAt)
		if (_s.column_ids.indexOf(td_class) === 0) {
			if (!first_row)
				table += '</tr>';
			
			table += '<tr id="service-' + row_number + '">';
		}
		// If first row, adjust the td_class (don't do it before)
		if (first_row) td_class += '-head';
		
		table += '<td class="' + td_class + '">' + _s.data[i][1].replace(/,([^ ])/g, ', $1') + '</td>';
		col_idx = this_col_idx; // for lookback comparison
	}
	$('body').append(table);
	
	// for searching:
	// each search control corresponds with a column id (A - Z), and each corresponding table element has that id as its class
	// in order to implement a AND search, as soon as a td is found to not have the search item, do $(this).parent().hide()
	// (first, $(table).slideUp(), then $(table).remove(), then $(master).clone(), then do the search)

});

// Create services detail view functionality
$('#results').on('click', 'td', function(evt) {
	var $service = $(this).parent(),
		service_id = $service.attr('id').substr(8),
		details_html = '';
	if (typeof _s.details[service_id] === 'undefined')
		return;

	for (var i = 0; i < _s.detail_ids.length; i++) {
		details_html += '<b class="' + _s.detail_ids[i] + '"><strong>' + _s.detail_titles[_s.detail_ids[i]] + '</strong>';
		if (_s.detail_titles[_s.detail_ids[i]].toLowerCase().indexOf('website') > -1)
			details_html += '<a href="http://' +_s.details[service_id][_s.detail_ids[i]] + '">' + _s.details[service_id][_s.detail_ids[i]] + '</a>';
		else
			details_html += _s.details[service_id][_s.detail_ids[i]];
		details_html += '</b>';
	}
	_s.toggle_details($service, details_html);
});

// Search form functionality
$('#services-search').on('submit', function() {
	$form = $(this);

	// first, set up our table to filter
	_s.$result_table = $('#master').clone();
	_s.$result_table.removeAttr('id');

	// second, remove existing _s.$results (will trigger results.removed event [see below])
	_s.remove_results();
	
	// meanwhile, do your filtering
	// start with simple indexOf matching
	/*$form.find('input, select').each(function() {
		var $ctrl = $(this);
		var type = $ctrl.attr('type');
		if (typeof type != 'undefined' && (type == 'submit' || type == 'reset'))
			return true; // skip to the next one
		
		_s.log('a control!');
		_s.log($ctrl);
	});*/
	// don't execute bottom line until results is hidden
	//while (_s.$results.is(':animated')) {
	//	true;
	//}
	
	return false;
});

// attach function to results.removed
_s.$results.on('results.removed', function() {
	var ctrls = _s.column_titles.slice(), // use slice to clone the array
		$ctrl,
		td_class;
	// now, do your filtering
	
	// First try indexOf() searches with all ctrls:
	$('#' + ctrls.join(',#')).each(function() {
		// Remove this ctrl id from ctrls array so it will not be processed later
		ctrls.remove(ctrls.indexOf(this.id));
		$ctrl = $(this);
		var search = $.trim($ctrl.val());
		if (search.length) {
			//.parent().hide()
			//_s.column_titles[_s.column_ids.indexOf($.data(this, 'column'))] 
			td_class = $.data(this, 'column');
			_s.$result_table.find('td.'+td_class).filter(function() {
				return this.innerHTML.toLowerCase().indexOf(search.toLowerCase()) == -1;
			}).parent().remove();
		}
	});
	
	// language regex matching:
	/*$ctrl = $('#language');
	var lang = $ctrl.val();
	if (lang.length) {
		
	}*/
	
	// reference needed (yes or no):
	$ctrl = $('input[name="reference"]:checked');
	var ref_needed = $ctrl.val();
	if (ref_needed > 0) {
		td_class = $.data($ctrl[0], 'column');
		_s.$result_table.find('td.'+td_class).filter(function() {
			if ($.trim(this.innerHTML).toLowerCase().indexOf('no') === 0)
				return ref_needed == 1;
			else
				return ref_needed == 2;
		}).parent().hide();
	}
		
	$('input[name="neighborhood"]');
	_s.$results.prepend(_s.$result_table).animate({marginLeft: 0}, 300, function() {
		_s.$results.animate({height: _s.$results.children().outerHeight()}, 500, function() {
			$(this).css('height', 'auto');
		});
	});
});

//jsonUrl: "http://spreadsheets.google.com/feeds/cells/0AraHJx4zIJGFdElYNklGN1RMMzdKeW1xNTZaVzE1Y3c/od6/public/basic?alt=json-in-script"