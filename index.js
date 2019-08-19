const DEBUG = false;
const input = document.getElementById('input');
const makeSoup = document.getElementById('make-soup');
const soupBowl = document.getElementById('soup-inner');
const soupPlacement = soupBowl.getBoundingClientRect();

const minTop = input.getBoundingClientRect().y + 100;

/**
 *
 * @function random
 * @description Gets a random number between min (inclusive) and max (exclusive)
 *
 * @param {Number} min - the minimum number
 * @param {Number} max - the maximum number
 *
 * @returns {Number} The random number
 *
 */
const random = (min, max) => Math.random() * (max - min) + min;

/**
 *
 * @function getPositions
 * @description Gets a randomized position within the soup-inner bouding box
 *
 * @param {String} dimension - which parameter to use when randomizing
 * @param {Set} acc - the default valuee of the reduce function
 *
 * @returns {Set} A list of positions
 *
 */
const getPositions = dimension => acc => {
    let pos = -1;
    do {
      pos = random(0, soupPlacement[dimension]);
    } while (acc.has(pos));
    acc.add(pos);
    return acc;
};

/**
 *
 * @function dropInLetters
 * @description Drops in the letters entered in the input into the bowl of soup
 *
 */
const dropInLetters = () => {
  if (DEBUG) {
    input.value = 'foobar';
  }

  if (!input.value.length) {
    alert('Please enter a word (20 chars max)');
    return;
  }
  
  if (input.value.length > 20) {
    alert('Please only enter a word with 20 characters maximum');
    return;
  }
  
  while (soupBowl.firstChild) {
    soupBowl.removeChild(soupBowl.firstChild);
  }
  
  /**
   *
   * @constant draggable
   * @property {Node} element - the element being dragged
   * @property {Boolean} isActive - whether the element is actively being dragged
   * @property {Number{}} offset - the x and y offset of the element
   *
   */
  const draggable = {
    element: null,
    isActive: false,
    offset: {
      x: 0,
      y: 0,
    }
  }

  const items = input.value.toUpperCase().split('').filter(letter => letter !== ' '); 
  const topPositions = [...items.reduce(getPositions('height'), new Set()).values()];
  const leftPositions = [...items.reduce(getPositions('width'), new Set()).values()];
  
  items.forEach((letter, index) => {

    const item = document.createElement('div');
    item.className = 'item';
    item.style.top = `${topPositions[index]}px`;
    item.style.left = `${leftPositions[index]}px`;
    
    /**
     *
     * @function selectLetter
     * @description An event handler for when the user selects a letter
     *
     * @param {*} e - the mouse event
     *
     */
    const selectLetter = e => {
      draggable.isActive = true;
      draggable.element = item;
      draggable.offset = {
        x: item.offsetLeft - e.clientX,
        y: item.offsetTop - e.clientY,
      }
      item.classList.add('active');
    };

    item.addEventListener('mousedown', selectLetter, false);

    soupBowl.appendChild(item);
    item.innerHTML = letter;
  });
  
  /**
   *
   * @function swirlLetter
   * @description An event handler for when the user moves a letter
   *
   * @param {*} e - the mouse event
   *
   */
  const swirlLetter = e => {
    e.preventDefault();
    const { isActive, element, offset } = draggable;
    if (isActive) {
        element.style.left = `${e.clientX + offset.x}px`;
        element.style.top  = `${e.clientY + offset.y}px`;
    }
  };
    
  /**
   *
   * @function dropLetter
   * @description An event handler for when the user drops a letter back into the bowl fter moving it
   *
   */
  const dropLetter = () => {
    const { element } = draggable;
    draggable.isActive = false;
    element.classList.remove('active');
  }
  
  document.addEventListener('mousemove', swirlLetter, false);
  document.addEventListener('mouseup', dropLetter, false);
};

makeSoup.addEventListener('click', dropInLetters, false);

/**
 *
 * @conditional 
 */
if (DEBUG) {
  const info = document.createElement("div");
  document.body.prepend(info);
  info.innerHTML = 'Position X : <br />Position Y : ';
  
  const displayPos = p => {
    info.innerHTML = 'Position X : ' + p.pageX + '<br />Position Y : ' + p.pageY;
  }
  addEventListener('mousemove', displayPos, false);
}


