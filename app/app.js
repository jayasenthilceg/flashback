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
        var template = _.template(
            jQuery( "script.myTmpl" ).html()
        );
        
        var data = this.fetchData(this);
        jQuery(".reveal .slides").append(template(data));
    },

    users: {},
    activities: [],
    notes: [],
    events: [],

    collectActivities: function() {
      return jQuery('.conversation.minimized,.conversation.activity')
    },
    
    filterNotes: function() {
      // note schema
      // { 
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
        that.users[$userEl.alt] = $userEl.src;
        note.user = $userEl.alt;
        
        that.notes.push(note);
      });
      
      console.log('filtered notes count : ', that.notes.length);
      
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
      var events = jQuery(this.activities).filter('.activity')
      debugger
    },
    
    fetchData: function() {
      jQuery('#activity_toggle').trigger('click');
      var that = this;
      jQuery(document).on("activities_toggle", function(event){
        console.log("activities toggle is called")
        that.activities = that.collectActivities();
        that.filterNotes();
      });
      var data = {name: "Jo",agents:["a","b"]}
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
