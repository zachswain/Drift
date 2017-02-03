/* global Drift, Backbone */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                ModuleModel : Backbone.Model.extend({
                    initialize : function() {
                        this.attachedTo = null;
                    },
                    
                    defaults : {
                        name : "Unknown Module",
                        type : null
                    },
                    
                    isType : function(type) {
                        return this.get("type")===type;
                    },
                    
                    attachTo : function(object) {
                        if( this.beforeAttach(object) ) {
                            this.attachedTo = object;
                            this.onAttach(object);
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    tick : function(e) {
                        this.onTick(e);
                    },
                    
                    onTick : function(e) {
                        
                    },
                    
                    beforeAttach : function(attachingTo) {
                        return true;
                    },
                    
                    onAttach : function(attachedTo) {
                        return true;
                    },
                    
                    beforeDetach : function(detachingFrom) {
                        return true;
                    },
                    
                    onDetach : function(detachedFrom) {
                        return true;
                    },
                    
                    getName : function() {
                        return this.get("name");
                    },
                    
                    getType : function() {
                        return this.get("type");
                    }
                })
            }
        }
    });
})(jQuery);