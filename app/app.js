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
