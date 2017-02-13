/* global _, Backbone, Drift, jQuery, numeral */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                ChatPaneView : Backbone.View.extend({
                    className : "ChatPaneView",
                    
                    initialize : function(parameters) {
                        
                        this.listenTo(Drift, "chatMessage", this.onChatMessage);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-ChatPaneView-template").html() );
                        var html = template({});
                        this.$el.html(html);
                    },
                    
                    onChatMessage : function(e) {
                        var div = $("<div></div>");
                        $(div).html(e.message);
                        this.$el.find("[data-role=Log]").append(div);
                        this.scrollToBottom();
                    },
                    
                    scrollToBottom : function() {
                        this.$el[0].scrollTop = this.$el[0].scrollHeight;
                    }
                })
            }
        }
    });
})(jQuery);
                    