(function() {
  return {
    initialize: function() {
      if(page_type == "ticket") {
        var fbbtn = '<li class="flashback-btn ticket-btns"><a href="#modal" id="video-click-btn"><button class="btn tooltip">Flashback</button></a></li>';
        jQuery(".collapse-content li:nth-child(1)").prepend(fbbtn);
        this.initializeTemplates();
        jQuery.getScript("{{'reveal.js' | asset_url}}", function () {
          jQuery("#video-click-btn").click(function(){
        
              Reveal.initialize({
                controls: false,
                autoSlide: 2000, //fade/slide/convex/concave/zoom
              });
          });
          jQuery("#replay-btn").click(function(){
              Reveal.slide(0);
              setTimeout(function(){
                jQuery('.playback').trigger('click');
              },1000) 
          })
        });
      }
      
    },
    initializeTemplates: function () {            
        _.templateSettings.variable = "data";
        this.fetchData();        
    },
    replaceTemplate: function(data){
      var arr = [1,2,3,4,5,6,7,8,9,10,11]
      var content =jQuery("#final_template");
      arr.each(function(a){
        var template = _.template(jQuery("script#"+a).html());
        content.append(template(data));
      })
      debugger
        
      jQuery(".reveal .slides").prepend(content.html());
    },

    users: {},
    activities: [],
    notes: [],
    events: [],

    collectActivities: function() {
      return jQuery('.conversation.minimized,.conversation.activity')
    },
    getColloborators: function(req){
      var arr = []
      for(var key in this.users) {
        if(key !="undefined" && key != req)  
          arr.push(key);
      }
      return arr;
      // return this.u
    },
    
    filterNotes: function() {
      // note schema
      // { 
      //   id: note_id,
      //   user: user_name, 
      //   timestamp: TIMESTAMP, 
      //   type: public | private | requester_reply
      //   content: HTML_CONTENT
      // }
      var that = this;
      jQuery(this.activities).filter('.conversation.minimized').each(function(i, $noteEl) {
        var note = {};
        $noteEl = jQuery($noteEl)
        note.timestamp = $noteEl.data('timestamp');
        
        note.content = $noteEl.find('.commentbox .helpdesk_note .details').text().strip();
        if($noteEl.has('.private-note').length > 0) {
          note.type = 'private';
        } else if ($noteEl.has('.commentbox-requester').length > 0) {
          note.type = 'requester_reply';
        } else {
          note.type = 'public';
        }
        var $userEl = jQuery($noteEl.find('.avatar-wrap .preview_pic img.thumb')); 
        that.users[$userEl.attr('alt')] = $userEl.attr('src');
        note.user = $userEl.attr('alt');
        note.id = $noteEl.attr('id');
        
        that.notes.push(note);
      });
      
      console.log('filtered notes count: ', that.notes.length);
      
    },

    getPublicNotes: function() {
      return this.notes.filter(function(note) { return note.type == 'public'; });
    },
    
    getPrivateNotes: function() {
      return this.notes.filter(function(note) { return note.type == 'private'; });
    },
    
    getRequesterReplies: function() {
      return this.notes.filter(function(note) { return note.type == 'requester_reply'});
    },
    
    
    generateEvents: function() {
      // event schema
      // { 
      //    user: USER_OBJECT, 
      //    timestamp: TIMESTAMP,
      //    type: status_change | priority_change | agent_change | group_change | note_addition
      //    data: STRING | NOTE_ID
      // }
      // TODO
      // var events = jQuery(this.activities).filter('.activity').each(function(i,a){
      var knownEventTypes = new Set(["agent", "status", "priority", "group"]);
      var that = this;
      jQuery('.conversation.activity').each(function(i,activity){
        // TODO
        // Attach user, timestamp
        // jQuerycollection.each - takes 2 args ! 
        var $activity = jQuery(activity);
        var timestamp = $activity.data('timestamp');
        var $userEl = $activity.find('.avatar-wrap .preview_pic img.thumb'); 
        that.users[$userEl.attr('alt')] = $userEl.attr('src');        
        // debugger
        // debugger
        var eventsFromActivity = [];
        ([].concat.apply([],$activity
          .find('.commentbox .details').text().strip().split('\\n')
          .map(function(data) { 
            return data.strip().split(',')
          })
          // we get a flatten array of events
        ))
        .each(function(data) {
          // Array.each - takes one arg ! 
          var event = data.replace("Set ","").split(" as ");
          // sanitize these events
          if(event.length == 2 && knownEventTypes.has(event[0].strip().toLowerCase())) {
            eventsFromActivity.push({eventType: event[0], eventData: event[1],timestamp: timestamp,user: $userEl.attr('alt')});
          }
        });

        jQuery.merge(that.events, eventsFromActivity);
        
      })
      // jQuery('.conversation').each(function(i,conversation){
      //   if(conversation.has('.activity')) {
      //     // general event except notes
      //     var eventsFromActivity = ([].concat.apply([],jQuery(activity)
      //       .find('.commentbox .details').text().strip().split('\\n')
      //       .map(function(data) { 
      //         return data.strip().split(',')
      //       })
      //     ))
      //     .map(function(data) {
      //       return data.replace("Set ","").split(' as ')
      //     })  
      //   } else if(conversation.has('.minimized')) {
      //     // note event
      //   }        
      // })
      // });
    },
    timeLine: function(){
      return this.events.concat(this.notes).sort(function(a,b){
        return a.timestamp - b.timestamp
      });
    },
    
    fetchData: function() {
      jQuery('#activity_toggle').trigger('click');
      var that = this;
      jQuery(document).on("activities_toggle", function(event){
        console.log("activities toggle is called")
        that.activities = that.collectActivities();
        that.filterNotes();
        that.generateEvents();
        that.timeLine();
        jQuery.map(jQuery('.conversation .avatar-wrap .preview_pic img.thumb'), 
            function(el) { 
              // debugger
              that.users[jQuery(el).attr('alt')] = jQuery(el).data('src'); 
            } 
        );
        var ticket = domHelper.ticket.getTicketInfo().helpdesk_ticket;
        var data = {
          requester_name: ticket.requester_name,
          agent_name: ticket.responder_name,
          agent_image: that.users[ticket.responder_name] || "/assets/misc/profile_blank_thumb.jpg",
          requester_image: that.users[ticket.requester_name] || "/assets/misc/profile_blank_thumb.jpg",
          ticket: ticket,
          colloborators: that.getColloborators(),
          image_mapping: that.users

        }
        debugger
        that.replaceTemplate(data)
        // debugger
      });

      // jQuery(document).live('ready',function(event){
      //   debugger
      // });

      return data;
    }
  }
})();

/*
{%comment%}

## Help: Using iparam (​installation parameters) in code

iparam: The ​settings that you want your users to configure when installing the
app.

iparam definition is made in config/iparam_en.yml file. To use the defined
iparam in code, use Liquid notation like:

- {{iparam.username}}
- {{iparam.country}}

{%endcomment%}
*/
