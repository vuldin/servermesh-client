import * as THREE from 'three'
import { FlyControls } from './FlyControls'
import * as d3 from 'd3'

let camera, controls, scene, renderer

let prevTime = performance.now()

init()
animate()

function init() {
    scene = new THREE.Scene()
	//scene.fog = new THREE.FogExp2(0x000000, 0.025)

    // camera
    const SCREEN_WIDTH = window.innerWidth
    const SCREEN_HEIGHT = window.innerHeight
    const VIEW_ANGLE = 75
    const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
    const NEAR = 0.1
    const FAR = 20000
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

    // camera position offset
    camera.position.set(25, 25, 25)
    camera.lookAt(scene.position)

    // fly controls
    const blockerDiv = document.getElementById('blocker')
    const instructionsDiv = document.getElementById('instructions')

    // crosshair
    const CROSSHAIR_RADIUS = Math.min(window.innerWidth, window.innerHeight) * .1

    const svg = d3.select('body').append('svg')
        .style('position', 'absolute')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

    // mousemove detector overlay
    svg
        .append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)
        .on('pointermove', mousemove)
        .on('pointerup', mouseup)

    // move crosshair to center of screen
    const g = svg.append('g')
        .attr('transform', `translate(${window.innerWidth/2}, ${window.innerHeight/2})`)

    // crosshair perimeter
    g.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr('stroke-dasharray', '1 6')
      .attr("r", CROSSHAIR_RADIUS)

    // crosshair line
    const crosshairLine = g.append('path')
        .style('fill', 'none')
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .attr('d', d3.line()([[0, 0]]))

    function mousemove(event) {
        if(controls) {
            const coords = d3.pointer(event)
            // TODO modify endpoint to be a fraction of the intended line
            let endpoints = [coords[0], coords[1]]

            // compensate for g translation
            endpoints = [endpoints[0] - window.innerWidth / 2, endpoints[1] - window.innerHeight/2]

            // stay within circle radius
            const lineLength = Math.sqrt((endpoints[0] * endpoints[0]) + (endpoints[1] * endpoints[1]))
            if(lineLength > CROSSHAIR_RADIUS) {
                let theta = Math.atan2(endpoints[1], endpoints[0])
                endpoints = [CROSSHAIR_RADIUS * Math.cos(theta), CROSSHAIR_RADIUS * Math.sin(theta)]
            }

            crosshairLine.attr('d', d3.line()([[0, 0], endpoints]))
        }
    }

    function mouseup() {
        crosshairLine.style('stroke-width', 1.5)
        document.body.style.cursor = 'none'
        instructionsDiv.style.display = 'none'
        blockerDiv.style.display = 'none'
        controls = new FlyControls( camera, document.body)
        controls.movementSpeed = 15
        controls.domElement = document.body
        controls.rollSpeed = Math.PI / 6
        controls.autoForward = false
        controls.dragToLook = false
        document.addEventListener('keyup', function(event) {
            if(event.code === 'Escape') {
                crosshairLine.style('stroke-width', 0)
                blockerDiv.style.display = 'block'
                instructionsDiv.style.display = ''
                controls = null
            }
        })
    }
    // end crosshair

    // grid
    const GRID_SIZE = 100
    const GRID_DIVISIONS = 10
    const RED = new THREE.Color(0x660000)
    const GREEN = new THREE.Color(0x006600)
    const BLUE = new THREE.Color(0x000066)
    // x, bottom
    const bottomGrid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, RED, RED)
    bottomGrid.position.set(0, -(GRID_SIZE / 2), 0)
    scene.add(bottomGrid)
    // y, front
    const frontGrid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, GREEN, GREEN)
    frontGrid.position.set(0, 0, -(GRID_SIZE / 2))
    frontGrid.rotation.x = Math.PI / 2
    scene.add(frontGrid)
    // z, left
    const leftGrid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, BLUE, BLUE)
    leftGrid.position.set(-(GRID_SIZE / 2), 0, 0)
    leftGrid.rotation.z = Math.PI / 2
    scene.add(leftGrid)

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize( window.innerWidth, window.innerHeight )
}

function animate() {
    requestAnimationFrame(animate)
	const time = performance.now()
    const delta = ( time - prevTime ) / 1000
    controls && controls.update(delta)
    prevTime = time
    renderer.render(scene, camera)
}