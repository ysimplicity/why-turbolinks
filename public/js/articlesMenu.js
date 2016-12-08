!function() {
  "use strict";
  
  vex.defaultOptions.className = 'vex-theme-try_turbolinks';
  vex.dialog.buttons.NO.text = 'Cancelar';
  
  function normalizeStringSpaces(str) {
    return str.replace(/[\s\n]+/g, ' ').trim();
  }

  function applyIDFormat(str) {
    return str.replace(/[^a-zA-Z0-9\s]+/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase();
  }

  function getArticles() {
    var articles = [];
    var articleElements = document.querySelectorAll('.container.content article');

    articleElements.forEach(function(article) {
      if( article ) {
        var articleTitle = article.querySelector('h5');
        var articleAuthor = articleTitle.querySelector('small');
        
        if (!article.getAttribute('id')) {
          var articleTitleWithAuthor = normalizeStringSpaces(articleTitle.innerText);
          var articleTitleID = applyIDFormat(articleTitleWithAuthor);
          article.setAttribute('id', articleTitleID);
        }
        
        var articleTitleText = normalizeStringSpaces(articleTitle.innerText.replace(articleAuthor.innerText, ''));
        
        articles.push({
          title: articleTitleText,
          id: article.getAttribute('id')
        });
      }
    });
    
    return articles;
  }

  function getArticleOptions() {
    var placeholder = [
      '<option value="" disabled selected>',
        'Selecione uma das opções',
      '</option>'
    ].join('');
    
    var options = getArticles().map(function(article) {
      return [
        '<option value="' + article.id + '">',
          article.title,
        '</option>'
      ].join('');
    });
    
    return [placeholder].concat(options).join('');
  }
  
  function getDialogInputs() {
    return [
      '<style>',
        '.vex-custom-field-wrapper {',
            'margin: 1em 0;',
        '}',
      '</style>',
      '<div class="vex-custom-field-wrapper">',
        '<div class="vex-custom-input-wrapper">',
          '<select name="articleID">',
            getArticleOptions(),
          '<select>',
        '</div>',
      '</div>'
    ].join('');
  }
  
  function getDialogMessage() {
    return 'Menu de artigos';
  }
  
  var dialogHelpers = {
    init: function() {
      this._queryForm();
      this._querySelect();
      
      return this;
    },
    
    isDisabled(el) {
      return el.hasAttribute('disabled');
    },
    isOptionDisabled: function() {
      var index = this.select.selectedIndex;
      
      return this.isDisabled(this.select.options[index]);
    },
    getSubmitButton: function() {
      return this.form.querySelector('button.vex-dialog-button-primary');
    },
    
    _queryForm: function() {
      this.form = document.querySelector('.vex-dialog-form')
    },
    _querySelect: function() {
      this.select = this.form.querySelector('select[name="articleID"]');
    }
  };
    
  function dialogAfterOpenHandler() {
    var h = dialogHelpers.init();
    
    h.select.addEventListener('change', function() {
      if (!h.isOptionDisabled()) {
        var button = h.getSubmitButton();
        
        if (h.isDisabled(button)) {
          button.removeAttribute('disabled');
        }
      }
    });
    
    if (h.select && h.isOptionDisabled()) {
      setTimeout(function() {
        h.getSubmitButton().setAttribute('disabled', 'disabled');
      }, 100);
    }
  }
  
  function dialogCallbackHandler(data) {
    if (data.articleID) {
      var top = document.getElementById(data.articleID).offsetTop;
      
      // Jump to article, using an anchor!
      window.scrollTo(0, top);
    }
    
    vex.dialog.buttons.YES.text = 'OK';
  }

  function showDialog() {
    vex.dialog.buttons.YES.text = 'Ir!';
    
    vex.dialog.open({
      input: getDialogInputs(),
      message: getDialogMessage(),
      callback: dialogCallbackHandler,
      afterOpen: dialogAfterOpenHandler
    });
  }
  
  document.addEventListener('turbolinks:load', function() {
    var menuButton = document.querySelector('#articles-menu-button');
    
    if (menuButton) {
      menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        showDialog();
      });
    }
  });
    
}();
