import _ from "lodash";

class EventManager {
    constructor() {      
      this.eventLookup = {};
    }
  
    off(event, callback) {
      var listeners = this.eventLookup[event];                
      if (event === "*") this.eventLookup = {}; 
      else if(!callback) this.eventLookup[event] = []; 
      else _.remove(listeners, { callback });
    }
  
    on(event, callback, scope) {
      var listeners = this.eventLookup[event];
      if (!listeners) this.eventLookup[event] = listeners = [];  
      listeners.push({ callback, scope });      
      return () => _.remove(listeners, { callback });
    }
  
    once(event, callback, scope) {      
      var on = (...data) => {
        this.off(event, on);
        callback.apply(scope, data);
      };
      return this.on(event, on);
    }
  
    fire(event, ...data) {
      var listeners = this.eventLookup[event];
      if (!listeners) return;
      listeners.forEach(list => {
        try {
          return list.callback.apply(list.scope, data);
        } catch(e) {
          return _.isError(e) ? e : new Error(e);
        }
      });      
    }
  }

  export default EventManager;