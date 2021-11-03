const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const rnd = (min, max) => Math.round(min + (Math.random() * (max - min)))

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

for (var i = 0; i < 3; i++) { //vytvorit par krabicek
	new shape(rnd(50, 200), rnd(50,200), rnd(0, 0xFFFFFE).toString(16), i).build()
}

setInterval(function() { //loop
	const list = document.getElementsByClassName('shape')
	for(let i = 0; i < list.length; i++){
		const e = list[i]
		console.log(e.left)
	}
},100)