// <canvas id="my_canvas"></canvas>
// <legend for="my_canvas"></legend>
// set tags above to html to show the chart
function drawLine() {
    const data = arguments.length ? arguments : arguments[0],
        ctx = data[0];
    ctx.save();
    ctx.strokeStyle = data[5];
    ctx.beginPath();
    ctx.moveTo(data[1], data[2]);
    ctx.lineTo(data[3], data[4]);
    ctx.stroke();
    ctx.restore();
}

function drawBar() {
    const data = arguments,
        ctx = data[0];
    ctx.save();
    ctx.fillStyle = data[5];
    ctx.fillRect(data[1], data[2], data[3], data[4]);
    ctx.restore();
}


var BarChart = function(options) {
    this.options = options;
    this.cvs = options.canvas;
    this.ctx = this.cvs.getContext('2d');
    this.colors = options.colors;

    this.draw = function() {
        let maxValue = 0;
        for (let categ in this.options.data) maxValue = Math.max(maxValue, this.options.data[categ]);
        maxValue+=5;

        const cvsActualHeight = this.cvs.height - this.options.padding * 2;
        const cvsActualWidth = this.cvs.width - this.options.padding * 2;
        let gridValue = 0;
        while (gridValue <= maxValue) {
            var gridY = cvsActualHeight * (1 - gridValue / maxValue) + this.options.padding;
            drawLine(this.ctx, 0, gridY, this.cvs.width, gridY, this.options.gridColor);

            this.ctx.save();
			const gradient = this.ctx.createLinearGradient(0, 0, 30, 0);
			gradient.addColorStop("0", "magenta");
			gradient.addColorStop("0.5", "blue");
			gradient.addColorStop("1.0", "red");
            this.ctx.fillStyle = gradient;
            this.ctx.font = 'bold 10px Georgia';
            this.ctx.fillText(gridValue, 0, gridY - 2)
            this.ctx.restore();

            gridValue += this.options.gridScale;
        }

        let barIndex = 0;
        let numberOfBars = Object.keys(this.options.data).length;
        let barSize = (cvsActualWidth) / numberOfBars;
        for (let categ in this.options.data) {
            const val = this.options.data[categ],
                barHeight = Math.round(cvsActualHeight * val / maxValue);
            drawBar(this.ctx, this.options.padding + barIndex * barSize,
                this.cvs.height - barHeight - this.options.padding, barSize,
                barHeight, this.colors[barIndex % this.colors.length]);
            barIndex++;
        }

        this.ctx.save();
        this.ctx.textBaseline = 'bottom';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'black';
        this.ctx.font = 'bold 14px 標楷體';
        this.ctx.fillText(this.options.seriesName, this.cvs.width/2, this.cvs.height);
        this.ctx.restore();

        //draw legend
        barIndex = 0;
        var legend = document.querySelector("legend[for='my_canvas']");
        var ul = document.createElement("ul");
        legend.append(ul);
        for (categ in this.options.data){
            var li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
            li.style.padding = "5px";
            li.textContent = categ;
            ul.append(li);
            barIndex++;
        }
    }
}
	const myCVS = document.getElementById('my_canvas');
	myCVS.width = 300;
	myCVS.height = 300;

    myVinyls = {
        '美國': 46,
        '英國': 27,
        '中國': 26,
        '俄羅斯': 19,
        '德國': 17,
        '日本': 12
    }

    let myBarchart = new BarChart({
        canvas: myCVS,
        seriesName:"里約奧運",
        padding: 20,
        gridScale: 5,
        gridColor: "#eeeeee",
        data: myVinyls,
        colors: ["#a55ca5", "#67b6c7", "#bccd7a", "#eb9743"]
    });
	myBarchart.draw();