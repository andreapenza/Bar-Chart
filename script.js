
 const container = document.getElementsByClassName("svg-container")[0];
 container.style.width = window.innerWidth - 50+ "px";
 container.style.height = window.innerHeight - 100 +"px";

var w = container.clientWidth, h = container.clientHeight, padding = 50;


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(function(dataset){
   DrawBar(dataset)});


function DrawBar(dataset){
   //create svg element
   const svg = d3.select(".svg-container")
              .append("svg")
              .attr("width", w)
              .attr("height",h)

   //create scaling constants
    const xScale = d3.scaleTime()
                   .domain([new Date(dataset.from_date), new Date(dataset.to_date)])
                   .range([padding, w - padding])

    const yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset.data, d => d[1])])
                   .range([h - padding, padding]);

    //create axis             
    const xAxis = d3.axisBottom(xScale);  
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("id","x-axis")
       .attr("transform","translate(0, "+ (h - padding) + ")")
       .call(xAxis)

    svg.append("g")
       .attr("id","y-axis")
       .attr("transform", "translate(" + padding + ", 0)")
       .call(yAxis)

    svg.append('text')
       .attr('x', 35)
       .attr('y', 30)
       .text('GDP');

    svg.append('text')
       .attr('x', w -75)
       .attr('y', h -15)
       .text('Timeline');

    // color scale
    const colorScale = d3.scaleSequential()
                         .domain([d3.max(dataset.data, d => d[1]), 0])
                         .interpolator(d3.interpolateCool);

    //create bars
    svg.selectAll("rect")
       .data(dataset.data)
       .enter()
       .append("rect")
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .attr("class","bar")
       .attr("x", d => xScale(new Date(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", (w-padding*2)/275)
       .attr("height", d => yScale(0) - yScale(d[1]))
       .attr("fill", d => colorScale(d[1]))
       .on("mouseover", function(d){
           d3.select(this)
             .attr("fill","rgba(0,0,0,0.8")            
           d3.select(".svg-container").append("div")
             .attr("id", "tooltip")
             .attr("class","tooltip")
             .attr("data-date",d[0])
             .attr("data-gdp", d[1])
             .style("left", w/2-90+"px" )
             .style("top", "20px")
             .html("<p>"+d[0] + "<br/>$ " + d[1] + " Billions")            
      })
       .on("mouseleave", function (d){
           d3.select(this).attr("fill", colorScale(d[1]) ); 
           d3.select(".svg-container")
              .select("div")
              .remove()
       })     
       window.onresize = function(){
         container.style.width = window.innerWidth -50 + "px";
         container.style.height = window.innerHeight - 100 +"px";
         w = container.clientWidth;
         h = container.clientHeight;
         d3.select("svg").remove();
         DrawBar(dataset,w,h);
       }  
};


