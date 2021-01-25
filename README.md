# Baller for Web (Alpha 0.0.4)

Baller is a cross-platform View Framework.  It's not an Application framework, it's just a way to implement a view e.g. a "User Interface Screen".  

Baller Views are written in TypeScript.   The reuslting transpiled JavaScript file can be use in any of the existing Baller runtimes - currently iOS, Android and Web.  

Here's an overview of the functionality.

## View Types:

- Div: basic view container
- Field: text entry field
- Button: button
- Image: image
- Label: text 
- List: easy, but powerful (iOS uses a UICollectionView to implement this)
 
## Services:

- Http: for retrieval of JSON data
- Store: for easy, efficient storage/retrieval of JSON data


## API Documentation

Docs are coming soon.  For now, it's pretty easy to review the Classes and their APIs by looking at the core TypeScript implementation in the git repo [here](https://github.com/bradedelman/baller-core).

## Getting Started on Web
 
It's really easy to get up and running with Baller on any Web Page.  Let's look at a simple web page example.

Create a file index.html with these contents.  The comments explain it all.  Very simple!

```
<!-- Baller Depends on Require -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>

<!-- Baller -->
<script src="https://cdn.jsdelivr.net/gh/bradedelman/baller-web@0.0.4/ballerWeb.js"></script>

<!-- Create a Div with an ID for the Baller View -->
<div id="root1" style="border: solid black; position: absolute; overflow: hidden; width: 400px; height: 840px;">
</div>

<!-- Use the View Script https://www.cleverfocus.com/baller/index.js -->
<script>
requirejs.config({
    baseUrl: 'https://www.cleverfocus.com/baller/' // tell Require root dir for View Scripts
});
BallerView("root1", "sample.js", 320); // create Baller With script
</script>

```



### That's it!  Open index.html and you'll see the sample view with a scrolling list of 1,000 numbers!   More coming soon on how to create your own views.
