// Application bootstrap.
$.domReady(function() {
    // Convert any markdown sections to HTML.
    var nav = $('.navigation ul');
    $('.md').each(function() {
        var html = document.createElement('div');
        $(html).html((new Showdown.converter()).makeHtml($(this).html()));
        html.className = this.className;
        html.id = this.id;
        // TODO: free from shackles of jQuery
        $(this).after(html);
        $(this).remove();
    });
    $('h1, h2, h3, h4, h5, h6').each(function(elem, i, wrapped) {
        this.setAttribute('id', $(this).text().replace(/[\s\W]+/g, '-').toLowerCase());

        var para = document.createElement('a'),
            api = document.createElement('a'),
            sectionLi = document.createElement('li'),
            sectionA = document.createElement('a');

        para.innerHTML = '&para;';
        para.setAttribute('title', 'permalink');
        para.className = 'para';
        para.href = '#' + this.id;


        sectionA.href = '#' + this.id;
        $(sectionA).text($(this).text());
        sectionLi.className = this.nodeName;
        sectionLi.appendChild(sectionA);
        nav.append(sectionLi);

        if (this.nodeName === 'H3') {
            api.innerHTML = 'api';
            api.setAttribute('title', 'API Documentation');
            api.className = 'api';
            api.href = '../docs/' + this.id + '.html';
            $(this).append(api);
        }

        $(this).append(para);
    });
    $('.run').each(function() {
        eval($(this).text());
    });
    sh_highlightDocument();
});
