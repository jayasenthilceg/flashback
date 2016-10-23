(function() {
  return {
    initialize: function() {
      if(page_type == "ticket") {
        var fbbtn = '<li class="flashback-btn ticket-btns"><a href="#flashback" id="video-click-btn"><button class="btn tooltip">Flashback</button></a></li>';
        jQuery(".collapse-content li:nth-child(1)").prepend(fbbtn);
        jQuery(".collapse-content li:nth-child(1)").prepend('<audio id="audio-player"></audio>');


        var audioElement = jQuery("#audio-player")[0];
          var _self = this;
        jQuery('#video-click-btn').click(function(){
            _self.playSong();
        });
          jQuery('.remodal-close').click(function(){
              audioElement.pause();
          });

        this.initializeTemplates();
        this.audioElement = audioElement;
        jQuery.getScript("{{'reveal.js' | asset_url}}", function () {
          jQuery("#video-click-btn").click(function(){
              Reveal.initialize({
                controls: false,
                autoSlide: 2000 //fade/slide/convex/concave/zoom
              });
          });
          Reveal.addEventListener('autoslideresumed', function(e) {
            jQuery("#audio-player")[0].play();
          });
          Reveal.addEventListener('autoslidepaused', function(e) {
            jQuery("#audio-player")[0].pause();
          });
          Reveal.addEventListener('lastSlide', function(e) {
            jQuery("#audio-player")[0].pause();
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
      playSong: function() {
          var status_name = domHelper.ticket.getTicketInfo().helpdesk_ticket.status_name;
          var is_resolved = (status_name == "Resolved" || status_name == "Closed");
          var happySongs = ["happy1", "happy2"];
          var neutralSongs = ["neutral1", "neutral2"];
          var randomValue = Math.floor(Math.random() * 10) % 2;
            if(is_resolved) {
                mp3Name = this.getmp3(happySongs[randomValue]);
            } else {
                mp3Name = this.getmp3(neutralSongs[randomValue]);
            }
        var audioElement = jQuery("#audio-player")[0];
        audioElement.setAttribute('src', mp3Name);
        audioElement.play();
    },
    addUser: function($userEl) {
      this.users[($userEl).attr('alt')] = ($userEl).data('src') || "/assets/misc/profile_blank_thumb.jpg";
      if($userEl.data('src') != undefined && this.users[($userEl).attr('alt')]  == "/assets/misc/profile_blank_thumb.jpg") {
        this.users[($userEl).attr('alt')] = ($userEl).data('src')
      }
    },
    replaceTemplate: function(data){
      // slide numbers vs names
      // id="1" data-slide-name="ticket_creation"
      // id="2" data-slide-name="agent_assignment"
      // id="3" data-slide-name="timer_running"
      // id="4" data-slide-name="first_response"
      // id="5" data-slide-name="customer_reply"
      // id="6" data-slide-name="agent_collaboration"
      // id="7" data-slide-name="agent_reply"
      // id="8" data-slide-name="ticket_closed"
      // id="9" data-slide-name="customer_rating"
      // id="10" data-slide-name="stars"	
      // id="11" data-slide-name="final_stats"	
      // id="12" data-slide-name="unresolved_start"
      // id="13" data-slide-name="status_transitions"

      var framesSelected = [1,2,4,5,6,7,8,9,10,11,12,13];
      var content =jQuery("#final_template");
      framesSelected.each(function(a){
        var template = _.template(jQuery("script#"+a).html());
        content.append(template(data));
      })
        
      jQuery(".reveal .slides").prepend(content.html());
    },

    users: {},
    activities: [],
    notes: [],
    events: [],

    audioElement: null,

    collectActivities: function() {
      return jQuery('.conversation.minimized,.conversation.activity')
    },
    getcollaborators: function(req,agent){
      var arr = []
      for(var key in this.users) {
        if(key !="undefined" && key != req && key != agent)
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
        that.addUser($userEl);
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

    getmp3: function (name) {
      var audios = { "medal_tracker": "https://s3-us-west-2.amazonaws.com/ganguly/Olympics+Medal+Tracker.mp3",
      "happy1": "https://s3-us-west-2.amazonaws.com/ganguly/happy1.mp3" ,
      "happy2": "https://s3-us-west-2.amazonaws.com/ganguly/happy2.mp3",
        "neutral1": "https://s3-us-west-2.amazonaws.com/ganguly/neutral1.mp3",
      "neutral2": "https://s3-us-west-2.amazonaws.com/ganguly/neutral2.mp3"
      }
      return audios[name];
    },

    
    generateEvents: function() {
      // event schema
      // { 
      //    user: USER_OBJECT, 
      //    timestamp: TIMESTAMP,
      //    type: status_change | priority_change | agent_change | group_change | note_addition
      //    data: STRING | NOTE_ID
      // }
      var knownEventTypes = new Set(["agent", "status", "priority", "group"]);
      var that = this;
      jQuery('.conversation.activity').each(function(i,activity){
        // Attach user, timestamp
        // jQuerycollection.each - takes 2 args ! 
        var $activity = jQuery(activity);
        var timestamp = $activity.data('timestamp');
        var $userEl = $activity.find('.avatar-wrap .preview_pic img.thumb'); 
        that.addUser($userEl);
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
        
      });
    },
    getSuccessParams: function(ticket){
      var arr =[]
      if(!ticket.fr_escalated)
        arr.push("First Response within SLA")
      if(!ticket.isescalated)
        arr.push("Resolved Within SLA")
      if(this.getcollaborators(ticket.requester_name,ticket.responder_name).length == 0)
        arr.push("Go Getter!")
      else
        arr.push("Great Team Work!")

      return arr
    },
    timeLine: function(){
      return this.events.concat(this.notes).sort(function(a,b){
        return a.timestamp - b.timestamp
      });
    },
    getCustomerRating: function(){
      return Math.floor(Math.random() * 3) + 3  ;
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
            function(userEl) { 
              $userEl = jQuery(userEl)
              if($userEl.parents(".redactor.conversation_thread").length == 0)
                that.addUser($userEl);
            } 
        );
        var ticket = domHelper.ticket.getTicketInfo().helpdesk_ticket;
        var data = {
          requester_name: ticket.requester_name,
          agent_name: ticket.responder_name,
          agent_image: that.users[ticket.responder_name] || "/assets/misc/profile_blank_thumb.jpg",
          requester_image: that.users[ticket.requester_name] || "/assets/misc/profile_blank_thumb.jpg",
          ticket: ticket,
          collaborators: that.getcollaborators(ticket.requester_name,ticket.responder_name).slice(0,3),
          collaborators_length:that.getcollaborators(ticket.requester_name,ticket.responder_name).length,
          image_mapping: that.users,
          success_params: that.getSuccessParams(ticket),
          is_agent_responded: that.getPublicNotes(that.notes).length > 0,
          is_customer_responded: that.getRequesterReplies(that.notes).length > 0,
          customer_rating: that.getCustomerRating(),
          note_count: that.notes.length,

        }
        data.is_unresolved = (data.ticket.status_name != "Resolved" && data.ticket.status_name != "Closed");
        try {
          data.fr_dueby_words = moment(ticket.frDueBy.split("T")[0], "YYYY-MM-DD").fromNow();
          data.resolution_dueby_words = moment(ticket.due_by.split("T")[0], "YYYY-MM-DD").fromNow();
          data.time_elapsed = moment(ticket.created_at.split("T")[0], "YYYY-MM-DD").fromNow();
        } catch(e) {
          data.fr_dueby_words = "";
          data.resolution_dueby_words = "";
          data.time_elapsed = "";
          console.error('dueby parse err' + e);
        }
        debugger
        that.replaceTemplate(data)
      });


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
