const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const rnd = (min, max) => Math.round(min + (Math.random() * (max - min)))
const $ = (id) => document.getElementById(id)

function getPos(element){
	const style = window.getComputedStyle(element)
	const matrix = style.transform || style.webkitTransform || style.mozTransform
	if (matrix === 'none') {
		return {
			x: 0,
			y: 0,
			z: 0
		}
	}
	const matrixType = matrix.includes('3d') ? '3d' : '2d'
	const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
	if (matrixType === '2d') {
		return {
			x: matrixValues[4],
			y: matrixValues[5],
			z: 0
		}
	}
	if (matrixType === '3d') {
		return {
			x: matrixValues[12],
			y: matrixValues[13],
			z: matrixValues[14]
		}
	}
}

class shape {
	constructor(height, width, color, id){
		this.width = width
		this.height = height
		this.color = color
		this.id = id
		this.isDown = false
	}
	
	build() {
		let tag = document.createElement('span')
		
		document.body.addEventListener('mousemove', event => {
			if(this.isDown){
				let moveX = event.pageX - (this.width / 2) + event.movementX
				let moveY = event.pageY - (this.height / 2) + event.movementY
				moveX = clamp(moveX, 0, 1200 - this.width)
				moveY = clamp(moveY, 0, 700 - this.height)
				tag.style.transform = 'translate(' + moveX + 'px,'+ moveY + 'px)'
			}
		},true)

		document.body.addEventListener('mouseup', event => {
			this.isDown = false
		},true)

		tag.addEventListener('mousedown', event => {
			let num = document.getElementsByClassName('shape')
			for(var i = 0; i < num.length; i++){
				num[i].style.zIndex = 0
			}
			tag.style.zIndex = 1
			this.isDown = true
		})
		
		tag.id = this.id
		tag.className = 'shape'
		tag.style.height = this.height
		tag.style.width = this.width
		tag.style.backgroundColor = this.color
		tag.style.border = '2px solid black'
		tag.style.position = 'absolute'
		document.body.appendChild(tag)
	}
	destroy() {
		document.body.removeChild(document.getElementById(this.id))
	}
}

let shapes = new Array()

for (let i = 0; i < 3; i++) { // vytvorit par krabicek
	shapes[i] = new shape(rnd(50, 200), rnd(50,200), rnd(0, 0xFFFFFE).toString(16), i)
	shapes[i].build()
}

setInterval(function(){
	move('1', 10, 10)
},1000)

function move(id, x, y){
	const originX = getPos($(id)).x
	const originY = getPos($(id)).y
	// console.log("X: " + originX)
	// console.log("Y: " + originY)
	$(id).style.transform = ''
}