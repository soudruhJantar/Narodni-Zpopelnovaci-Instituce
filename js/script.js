var num = 0
var money = 2

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const rnd = (min, max) => Math.round(min + (Math.random() * (max - min)))
const $ = (id) => document.getElementById(id)

var allArray = []
var jewArray = []
var blackArray = []

class type {
  constructor(arr, counter, buyPrice) {
    this.arr = arr
    this.counter = counter
    this.buyPrice = buyPrice
    this.sellPrice = buyPrice * 1.5
  }
}

var typeJew = new type(jewArray, $('jewCounter'), 2)
var typeBlack = new type(blackArray, $('blackCounter'), 10)

var height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
  document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
var width = Math.max(document.body.scrollWidth, document.body.offsetWidth,
  document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)

function isCollide(a, b) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    ((aRect.top - 270 + aRect.height) < (bRect.top)) ||
    (aRect.top > (bRect.top + bRect.height)) ||
    ((aRect.left - 70 + aRect.width) < bRect.left) ||
    (aRect.left > (bRect.left - 70 + bRect.width))
  );
}

function addMoney(amount) {
  money += amount
  $('moneyCounter').innerHTML = Math.round(money) + ' RM'
}

function buy (type) {
  if(money >= type.buyPrice) {
    const p = new person(200, 100, num, type)
    addMoney(-type.buyPrice)
    type.arr.push(p)
    allArray.push(p)
  }
}

function buyJew () {
  if (money >= 2) {
    addMoney(-2)
    const p = new person(200, 100, num, typeJew)
    num++
    jewArray.push(p)
    allArray.push(p)
    p.build()
    $('jewCounter').innerHTML = jewArray.length
  }
}

function buyNigger() {
  if (money >= 10) {
    addMoney(-10)
    const p = new person(200, 100, num, typeBlack)
    num++
    blackArray.push(p)
    allArray.push(p)
    p.build()
    $('blackCounter').innerHTML = blackArray.length
  }
}

class person {
  constructor(height, width, id, type) {
    this.type = type
    this.width = width
    this.height = height
    this.id = id
    this.isDown = false
    this.addY = 2
  }

  build() {

    var tag = document.createElement('div')

    tag.style.top = 0
    tag.style.left = width * 0.5

    document.body.addEventListener('mousemove', event => {
      if (this.isDown) {
        let moveX = event.pageX - (this.width / 2) + event.movementX
        let moveY = event.pageY - (this.height / 2) + event.movementY
        tag.style.top = clamp(moveY, 0, height - this.height)
        tag.style.left = clamp(moveX, 0, width * 0.65 - this.width)
      }
    }, true)

    document.body.addEventListener('mouseup', event => {
      this.isDown = false
    }, true)

    tag.addEventListener('mousedown', event => {
      let num = document.getElementsByClassName('person')
      for (var i = 0; i < num.length; i++) {
        num[i].style.zIndex = 0
      }
      tag.style.zIndex = 1
      this.isDown = true
    }, true)

    switch (this.type) {
      case typeJew:
        tag.style.background = "url('img/JewTexture.png')"
        break
      case typeBlack:
        tag.style.background = "url('img/BlackTexture.png')"
        break
    }
    tag.id = this.id
   tag.className = 'person'
    tag.style.height = this.height
    tag.style.width = this.width
    tag.style.backgroundPosition = 'center'
    tag.style.backgroundSize = 'cover'
    tag.style.position = 'absolute'
    tag.style.display = 'block'

    document.body.appendChild(tag)
  }

  destroy () {
    const arr = this.type.arr
    arr.splice(arr.indexOf(this), 1)
    allArray.splice(arr.indexOf(this), 1)
    document.body.removeChild(document.getElementById(this.id))
  }

  applyGravity () {
    if (!this.isDown) {
      this.addY += .6
      const topVal = clamp(parseInt($(this.id).style.top, 10), 0, height - this.height)
      $(this.id).style.top = Math.min((topVal + this.addY), height - this.height)
    } else {
      this.addY = 0
    }
  }

  checkFire() {
    if (isCollide($(this.id), $('fire'))) {
      addMoney(this.type.sellPrice)
      this.destroy()
    }
  }
}

setInterval (function() { // LOOP

  /*for (let i = 0; i < jewArray.length; i++) {
    jewArray[i].applyGravity()
    if (isCollide($(jewArray[i].id), $('fire'))) {
      addMoney(5)
      jewArray[i].destroy()
    }
  }

  for (let i = 0; i < blackArray.length; i++) {
    blackArray[i].applyGravity()
    if (isCollide($(blackArray[i].id), $('fire'))) {
      addMoney(15)
      blackArray[i].destroy()
    }
  }*/

  for (let i = 0; i < allArray.length; i++) {
    allArray[i].applyGravity()
    allArray[i].checkFire()
  }
}, 10)