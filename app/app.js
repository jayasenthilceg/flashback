(function() {
  return {
    initialize: function() {
      console.log("Basic Demo App!");
      if(page_type == "ticket") {
        var requesterName = domHelper.ticket.getTicketInfo()
          .helpdesk_ticket.requester_name;
        jQuery('#apptext').text("Ticket createddddsad by " + requesterName);
        
        _.templateSettings.variable = "data";
        var template = _.template(
            jQuery( "script.myTmpl" ).html()
        );
        
        var data = {name: "Jo"};       
        debugger
        jQuery(".reveal .slides #slide5").html(template(data));           // Insert HTML string into DOM

        

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
