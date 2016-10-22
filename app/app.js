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
        
        var data = this.fetchData();
        jQuery(".reveal .slides").append(template(data));
    },
    fetchData: function () {
      var noteDetails = {};
      var users = {};
      var activities = [];
      
      
      
      jQuery('#activity_toggle').trigger('click');
      jQuery(document).on("activities_toggle", function(event){

        console.log("activities toggle is called")
        
        // <<< activity fetching starts
        // TODO
        
        // activity fetching ends >>>
        
        function collectActivities() {
          return jQuery('.conversation.minimized,.conversation.activity')
        }
        
        var activities = collectActivities();
        generateEvents(activities)
        filterNotes(activities);
        
        // note schema
        // { 
        //   user: user_name, 
        //   timestamp: TIMESTAMP, 
        //   type: public | private | requester_reply
        //   content: HTML_CONTENT
        // }
        function filterNotes(activities) {
          var notes = [];
          jQuery(activities).filter('.conversation.minimized').each(function(i, $noteEl) {
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
            users[$userEl.alt] = $userEl.src;
            note.user = $userEl.alt;
            
            notes.push(note);
          });
          
          console.log('filtered notes count : ', notes.length);
          
        }

        function getPublicNotes(notes) {
          return notes.filter(function(note) { console.log(note.type); return note.type == 'public'; });
        }
        
        function getPrivateNotes(notes) {
          return notes.filter(function(note) { return note.type == 'private'; });
        }
        
        function getRequesterReplies(notes) {
          return notes.filter(function(note) { return note.type == 'requester_reply'});
        }
        
        // event schema
        // { 
        //    user: USER_OBJECT, 
        //    timestamp: TIMESTAMP,
        //    type: status_change | priority_change | agent_change | group_change | note_addition
        //    data: STRING | NOTE_ID
        // }
        
        function generateEvents(activities) {
          // TODO
          var events = jQuery(activities).filter('.activity')
          debugger
        }
        
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
