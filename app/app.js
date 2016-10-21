(function() {
  return {
    initialize: function() {
      console.log("Basic Demo App!");
      if(page_type == "ticket") {
        var requesterName = domHelper.ticket.getTicketInfo()
          .helpdesk_ticket.requester_name;
        jQuery('#apptext').text("Ticket createddddsad by " + requesterName);
    
        var htmlTemp = jQuery.template("htmlTempKey", jQuery("#myTmpl").html()); // Get compiled template
        var data = {name: "Jo"};           // Define data
        var html = jQuery.tmpl("htmlTempKey", data);      // Render template using data - as HTML string
        jQuery(".reveal .slides #slide5").html(html[0]);           // Insert HTML string into DOM

        

        jQuery.getScript("{{'reveal.js' | asset_url}}", function () {
          jQuery("#video-click-btn").click(function(){
        
              Reveal.initialize({
              controls: false,
              autoSlide: 2000,
              progress: true,

              // theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
              transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/
            });
          });
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
