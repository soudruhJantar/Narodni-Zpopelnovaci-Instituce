var num = 0
var money = 0

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const rnd = (min, max) => Math.round(min + (Math.random() * (max - min)))
const $ = (id) => document.getElementById(id)

function isCollide(a, b) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    ((aRect.top - 270 + aRect.height) < (bRect.top)) ||
    (aRect.top > (bRect.top + bRect.height)) ||
    ((aRect.left - 100 + aRect.width) < bRect.left) ||
    (aRect.left > (bRect.left - 100 + bRect.width))
  );
}
function addMoney(amount){
  money += amount
  $('moneyCounter').innerHTML = money + ' RM'
}
function buyJew(){
  if (money >= 2){
    addMoney(-2)
    const p = new person(200, 100, num)
    num++
    persons.push(p)
    p.build()
    $('jewCounter').innerHTML = persons.length
    $('jewError').innerHTML = ''
  } else {
    $('jewError').innerHTML = 'not enough money'
  }
}

class person {
	constructor(height, width, id){
		this.width = width
		this.height = height
		this.id = id
		this.isDown = false
		this.addY = 2
	}

	build() {

		var tag = document.createElement('div')

		tag.style.top = 0
		tag.style.left = 700 + rnd(-50, 50)

		document.body.addEventListener('mousemove', event => {
			if(this.isDown){
				let moveX = event.pageX - (this.width / 2) + event.movementX
				let moveY = event.pageY - (this.height / 2) + event.movementY
				tag.style.top = clamp(moveY, 0, 900 - this.height)
				tag.style.left = clamp(moveX, 0, 1400 - this.width)
			}
		}, true)

		document.body.addEventListener('mouseup', event => {
			this.isDown = false
		}, true)

		tag.addEventListener('mousedown', event => {
			let num = document.getElementsByClassName('person')
			for(var i = 0; i < num.length; i++){
				num[i].style.zIndex = 0
			}
			tag.style.zIndex = 1
			this.isDown = true
		}, true)

		{
		tag.id = this.id
		tag.className = 'person'
		tag.style.height = this.height
		tag.style.width = this.width
		tag.style.background = "url('img/JewTexture.png')"
		tag.style.backgroundPosition = 'center'
		tag.style.backgroundSize = 'cover'
		tag.style.position = 'absolute'
		tag.style.display = 'block'
		}
		document.body.appendChild(tag)
	}
	destroy() {
    persons.splice(persons.indexOf(this), 1)
		document.body.removeChild(document.getElementById(this.id))
    $('jewCounter').innerHTML = persons.length
	}
	applyGravity() {
		if(!this.isDown) {
			this.addY += .6
			const topVal = clamp(parseInt($(this.id).style.top, 10), 0, 900 - this.height)
			$(this.id).style.top = Math.min((topVal + this.addY), 900 - this.height)
		} else {
			this.addY = 0
		}
	}
}

var persons = []

persons.push(new person(200, 100, 'initial'))
persons[0].build()

setInterval(function(){ // LOOP

	for (let i = 0; i < persons.length; i++) {
		persons[i].applyGravity()
		if(isCollide($(persons[i].id), $('fire'))){
			persons[i].destroy()
			addMoney(5)
		}
	}

}, 10)
