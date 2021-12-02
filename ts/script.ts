var num = 0
var money = 5

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
const rnd = (min: number, max: number) => Math.round(min + (Math.random() * (max - min)))
const $ = (id: string) => document.getElementById(id)

var allArray = []

var jewArray = []
var blackArray = []
var richArray = []
var transArray = []
var baldArray = []

function arrToStr(type: type) { // "id:top:left"
  const arr = type.arr
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += arr[i].id
    str += ':'
    str += $(arr[i].id).style.top
    str += ':'
    str += $(arr[i].id).style.left
    if (!(i == arr.length - 1)) str += '-'
  }
  if (str.endsWith('-')) {
    str.slice(0, -1)
  }
  return str
}

class saveLoad {
  static saveGame() {
    localStorage.setItem('money', money.toString())
    localStorage.setItem('jewArray', arrToStr(typeJew))
    localStorage.setItem('blackArray', arrToStr(typeBlack))
    localStorage.setItem('richArray', arrToStr(typeRich))
    localStorage.setItem('transArray', arrToStr(typeTrans))
    localStorage.setItem('baldArray', arrToStr(typeJew))
  }
  static loadGame() {
    addMoney(parseInt(localStorage.getItem('money')))
  }
}

class type {

  arr: Array<person>
  counter: HTMLElement
  texture: string
  buyPrice: number
  sellPrice: number

  constructor(arr: Array<person>, counter: HTMLElement, texture: string, buyPrice: number, sellPrice?: number) {
    this.arr = arr
    this.counter = counter
    this.texture = texture
    this.buyPrice = buyPrice
    if (sellPrice == null) this.sellPrice = this.buyPrice * 1.5
    else this.sellPrice = sellPrice
  }
}

var typeJew = new type(jewArray, $('jewCounter'), "url('img/JewTexture.png')", 2, 5)
var typeBlack = new type(blackArray, $('blackCounter'), "url('img/BlackTexture.png')", 10)
var typeRich = new type(richArray, $('richCounter'), "url('img/RichTexture.png')", 100)
var typeTrans = new type(transArray, $('transCounter'), "url('img/TransTexture.png')", 500)
var typeBald = new type(baldArray, $('baldCounter'), "url('img/BaldTexture.png')", 2000)

var height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
  document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
var width = Math.max(document.body.scrollWidth, document.body.offsetWidth,
  document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)

function isCollide(a: Element, b: Element) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    ((aRect.top - 270 + aRect.height) < (bRect.top)) ||
    (aRect.top > (bRect.top + bRect.height)) ||
    ((aRect.left - 70 + aRect.width) < bRect.left) ||
    (aRect.left > (bRect.left - 70 + bRect.width))
  );
}

function addMoney(amount: number) {
  money += amount
  $('moneyCounter').innerHTML = Math.round(money) + ' RM'
}

function buy(type: type) {
  if (money >= type.buyPrice) {
    const p = new person(200, 100, num.toString(), type)
    addMoney(-type.buyPrice)
    type.arr.push(p)
    allArray.push(p)
    p.build()
    type.counter.innerHTML = type.arr.length.toString()
    $('allCounter').innerHTML = 'Celkem lidí: ' + allArray.length.toString()
  }
}

class person {

  type: type
  width: number
  height: number
  id: string
  isDown: boolean
  addY: number

  constructor(height: number, width: number, id: string, type: type) {
    this.type = type
    this.width = width
    this.height = height
    this.id = id
    this.isDown = false
    this.addY = 20
    num += 1
  }

  build() {
    var tag = document.createElement('div')

    tag.style.top = '0'
    tag.style.left = (width * 0.5).toString()

    document.body.addEventListener('mousemove', event => {
      if (this.isDown) {
        let moveX = event.pageX - (this.width / 2) + event.movementX
        let moveY = event.pageY - (this.height / 2) + event.movementY
        tag.style.top = clamp(moveY, 0, height - this.height).toString()
        tag.style.left = clamp(moveX, 0, width * 0.65 - this.width).toString()
      }
    }, true)

    document.body.addEventListener('mouseup', event => {
      this.isDown = false
    }, true)

    tag.addEventListener('mousedown', event => {
      const n = Array.from(document.getElementsByClassName('mat-form-field-infix') as HTMLCollectionOf<HTMLElement>)
      for (var i = 0; i < n.length; i++) {
        n[i].style.zIndex = '0'
      }
      tag.style.zIndex = '1'
      this.isDown = true
    }, true)

    tag.style.backgroundImage = this.type.texture

    tag.id = this.id
    tag.className = 'person'
    tag.style.height = this.height.toString()
    tag.style.width = this.width.toString()
    tag.style.backgroundPosition = 'center'
    tag.style.backgroundSize = 'cover'
    tag.style.position = 'absolute'
    tag.style.display = 'block'

    document.body.appendChild(tag)
  }

  destroy() {
    const arr = this.type.arr
    if (arr.indexOf(this) > -1) {
      arr.splice(arr.indexOf(this), 1)
      allArray.splice(allArray.indexOf(this), 1)
    }

    this.type.counter.innerHTML = arr.length.toString()

    document.body.removeChild(document.getElementById(this.id))

    $('allCounter').innerHTML = 'Celkem lidí: ' + allArray.length.toString()
  }

  applyGravity() {
    if (!this.isDown) {
      this.addY += 1.5
      $(this.id).style.top = clamp(parseInt($(this.id).style.top) + this.addY, 0, height - this.height).toString()
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

setInterval(function () { // LOOP
  for (let i = 0; i < allArray.length; i++) {
    allArray[i].applyGravity()
    allArray[i].checkFire()
  }
}, 20)