export function forEach(collection, callback) {
  for (let i = 0; i < collection.length; i++) {
    callback(collection[i]);
  }
}

export function mapEach(collection, callback) {
  let newCollection = [];

  forEach(collection, item => newCollection.push(callback(item)));

  return newCollection;
}


export const makeArray = (data) => Array.prototype.slice.call(data);


function oneEventCall(element, event, callback) {
  return function fn() {
    callback.apply( null, arguments );

    element.removeEventListener( event, fn );
  }
}

function eventListeners(one, action, element, events, callback, useCapture = false) {
  const prop = `${action}EventListener`;

  forEach(events.split(' '), event => {
    const fn = one ? oneEventCall( element, event, callback ) : callback;

    element[prop]( event, fn, useCapture )
  });
}

function applyEventListeners(action, args, one) {
  eventListeners.apply( null, [one, action].concat( makeArray(args) ) );
}

export function removeEventListeners() {
  applyEventListeners('remove', arguments, false);
}

export function addEventListeners() {
  applyEventListeners('add', arguments, false);
}

export function oneAddEventListeners() {
  applyEventListeners('add', arguments, true);
}
