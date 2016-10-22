(function() {
  return {
    initialize: function() {
      console.log("Basic Demo App!");
      if(page_type == "ticket") {
        var requesterName = domHelper.ticket.getTicketInfo()
          .helpdesk_ticket.requester_name;
        jQuery('#apptext').text("Ticket createddddsad by " + requesterName);
        this.initializeTemplates();
        jQuery.getScript("{{'reveal.js' | asset_url}}", function () {
          jQuery("#video-click-btn").click(function(){
        
              Reveal.initialize({
                controls: false,
                autoSlide: 2000,
                progress: true,
                width: "100%",
                height: "100%",
                margin: 0,
                minScale: 1,
                maxScale: 1,
                transition: Reveal.getQueryHash().transition,

                // theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
                //transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/
              });
          });
          jQuery("#reply-btn").click(function(){
              Reveal.slide(-1); 
          })
        });
      }
      else if(page_type == "contact"){
        var agentName = domHelper.contact.getContactInfo().user.name;
        jQuery('#apptext').text("Hello " + agentName);
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
        
        // <<< user fetching starts
        jQuery.map(jQuery('.conversation.minimized .avatar-wrap .preview_pic img.thumb'), 
            function(el) { users[el.alt] = el.src; } 
        );
        // user fetching ends >>>
        
        // <<< note fetching starts
        // TODO
        noteDetails.count = jQuery('.conversation.minimized').length;
        console.log("notes count: ", noteDetails.count);  
        // note fetching ends >>>
        
        // <<< activity fetching starts
        // TODO
        debugger
        // activity fetching ends >>>
        
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
