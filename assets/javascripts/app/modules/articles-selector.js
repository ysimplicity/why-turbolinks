import smoothScroll from 'smooth-scroll';

import vex from '../vex';
import { mapEach } from '../helpers';
import {
  oneTurbolinksLoad,
  handleElementEventOnTurbolinksLifeCycle
} from '../turbolinks_lcm';

function normalizeStringSpaces(str) {
  return str.replace(/[\s\n]+/g, ' ').trim();
}

function applyIDFormat(str) {
  return str.replace(/[^a-zA-Z0-9\s]+/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
}

function getArticles() {
  const articleElements = document.querySelectorAll('.container.content article');

  return mapEach(articleElements, article => {
    const articleTitle = article.querySelector('h5');
    const articleAuthor = articleTitle.querySelector('small');

    if ( !article.getAttribute('id') ) {
      const articleTitleWithAuthor = normalizeStringSpaces(articleTitle.innerText);
      const articleTitleID = applyIDFormat(articleTitleWithAuthor);
      article.setAttribute('id', articleTitleID);
    }

    let articleTitleText = normalizeStringSpaces(articleTitle.innerText)

    if ( articleAuthor ) {
      articleTitleText = normalizeStringSpaces(articleTitleText.replace(articleAuthor.innerText, ''));
    }

    return {
      title: articleTitleText,
      id: article.getAttribute('id')
    };
  });
}

function getArticleOptions() {
  const placeholder =`
    <option value="" disabled selected>
      Escolha uma das opções
    </option>
  `;

  const options = mapEach(
    getArticles(),
    article => `<option value="${article.id}">${article.title}</option>`
  );

  return [placeholder].concat(options).join('');
}

function getDialogInputs() {
  return `
    <style>
      .vex-custom-field-wrapper {
        margin: 1em 0;
      }
    </style>
    <div class="vex-custom-field-wrapper">
      <div class="vex-custom-input-wrapper">
        <select name="articleID">
          ${ getArticleOptions() }
        <select>
      </div>
    </div>
  `;
}

function getDialogMessage() {
  return 'Artigos:';
}

const DialogHelpers = {
  init: function() {
    this._queryForm();
    this._querySelect();

    return this;
  },

  isDisabled(el) {
    return el.hasAttribute('disabled');
  },
  isOptionDisabled: function() {
    const index = this.select.selectedIndex;

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
  const h = DialogHelpers.init();

  h.select.addEventListener('change', function() {
    if (!h.isOptionDisabled()) {
      const button = h.getSubmitButton();

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
    const el = document.getElementById(data.articleID);

    // const elTop = el.offsetTop;
    // const parentTop = el.offsetParent.offsetTop;
    // // Jump to article using an anchor.
    // window.scrollTo(0, (elTop + parentTop));

    smoothScroll.animateScroll(el);
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

function handleFABClick(e) {
  e.preventDefault();

  showDialog();
}

function handleElementEvent(listen) {
  const fab = document.querySelector('#articles-menu-button');

  if (fab) {
    listen(fab, 'click', handleFABClick);
  }
}

export default {
  init() {
    oneTurbolinksLoad( () => smoothScroll.init() );

    handleElementEventOnTurbolinksLifeCycle(
      handleElementEvent,
      { DOMSideEffects: true }
    );
  }
}
