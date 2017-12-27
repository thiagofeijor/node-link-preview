var request = require('request');
var cheerio = require('cheerio');

class LinkPreview {

    search(link, success, err) {
        if (!(link.indexOf('http') > -1)){
            link = 'http://' + link;
        }

        if(ValidURL(link)){
            err();
            return false;
        }

        request(link, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);

                let titleTag = $('title').text();
                let titleMeta = $('meta[property="og:title"]').attr('content');
                let title = ( !titleMeta ? titleTag : titleMeta );
                
                let img = $('meta[property="og:image"]').attr('content');
                
                let descriptionMeta = $('meta[property="og:description"]').attr('content');
                let descriptionTag = $('meta[property="description"]').text();
                let description = ( !descriptionMeta ? descriptionTag : descriptionMeta );
                    
                success({ img: img, title: title, description: description, link: body.link});
                return false;
            }else{
                err();
                return false;
            }
        });
    }

    ValidURL(str) {
        var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
          '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
          '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
          '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
          '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
          '(\#[-a-z\d_]*)?$','i'); // fragment locater
        return pattern.test(str);
    }
}

module.exports = new LinkPreview();