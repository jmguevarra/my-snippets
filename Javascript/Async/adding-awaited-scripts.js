async function appendScripts() {
  await Promise.all(scripts.map(async function(srcLink){
    console.log(srcLink);
    const scriptNode = document.createElement('script');
    scriptNode.type = "text/javascript";
    scriptNode.src = srcLink;
    document.body.append(scriptNode);
  }));
  console.log("All scripts have been appended to the document body.");
}
