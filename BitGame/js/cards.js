(function() {
        var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                /**
                 * Your drawings need to be inside this function otherwise they will be reset when 
                 * you resize the browser window and the canvas goes will be cleared.
                 */
                drawStuff(); 
        }
        resizeCanvas();
        
        function drawStuff() {
                context.fillStyle = "white";
                context.lineWidth = "5";
                l1 = context.fillRect(300,100,800, 80);
                context.fillStyle = "red";
                l1.fillRect(0,0,100,80);
        }
})();
