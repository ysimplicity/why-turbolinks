Contributing Guidelines
-----------------------
1. Do you create a new html file? So, ensure that it was put in service-worker.js `files` array.
  * After update the `files` array, increase the version number of CACHE_NAME variable.
  
2. Do you change some html content? So, increase the version number of CACHE_NAME variable, in service-worker.js `files` array.

3. Ensure the following requirements in all html files.
  1. Update the page title, changing the text after the pipe character.
  2. The navbar has a link to the new page?
    * When do you access the page, it appeared active in the navbar? If not, add the `activate` CSS class in the link element with the `.popover-link` class attribute.

4. Ensure if all articles has an **id** attribute.
``` html
<article id="documentacao-oficial">
  <a href="https://github.com/turbolinks/turbolinks" data-turbolinks=false target="_blank">
    <!-- ... -->
  </a>
</article>
```
