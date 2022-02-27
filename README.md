<h3>D3 manipulating Data Visualization - Data Journalism</h3>
<hr>

<img src="https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif" alt="Newsroom" width="240" height="180" align="right">

Using the States dataset provided in <a href="/D3_data_journalism/assets/data/data.csv">data.csv</a>, the data is presented to the HTML file via Javascript using D3.csv() <br>
The dataset includes data on rates of income, obesity, poverty, etc. by state. 

<hr>

The following is a preview of how the Scatter Plot works:

<img src="/D3_data_journalism/snips/scatterplot.gif" alt="Scatter Plot" width="800" height="363">

Users are able to interact with the scatter plot by selecting the X and Y Axis Labels and the Scatter plot would change dynamically after fetching the appropriate data<br>

In order to archieve the above, the data displayed needs to be updated according to user's selection. 
The following snippet of code shows the conditionals to update the tool tip with the selected X and Y axis, the location and data on the circle and the label texts (Active/Inactive) on the Scatter Plot.

<img src="/D3_data_journalism/snips/updatingxaxis.JPG" alt="Updating Axis" width="800" height="363"> <br>

Within the circlesGroup, contains the function to update the tool tip, rendered text and rendered circles, as well as the X and Y axis. <br>

<img src="/D3_data_journalism/snips/updates.JPG" alt="Updates Circles" width="800" height="160"> <br>

The tool tip is initialised by the variable circlesGroup first, then another function is then required to update the Tool tip otherwise it would not be updated when an X and Y Axis are selected.
Even so, the conditionals are set for the tool tip in order to be interactive.
<img src="/D3_data_journalism/snips/tooltip.JPG" alt="Tool Tip" width="800" height="463"> <br>



<a href="https://foofx88.github.io/D3_Manipulation-Data_Journalism/">Visit the page here</a> or <a href="/D3_data_journalism/assets/js/app.js">Explore the Javascript codes</a>
