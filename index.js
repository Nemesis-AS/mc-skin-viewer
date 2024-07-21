function main() {
    document.getElementById("usernameForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("usernameInput").value;

        fetchSkin(username);
        // fetchS
    });

    // changeTexture();
}

async function fetchSkin(username) {
    try {
        const res = await fetch("https://api.ashcon.app/mojang/v2/user/" + username);
        if(res.status != 200) {
            throw new Error("An error occurred while fetching skin!");
        }

        const json = await res.json();
        console.log(json);

        // const skin = json.textures.skin.data;
        const skinUrl = json.textures.skin.url;

        if (!skinUrl) {
            throw new Error("No skin found!");
        }

        console.log(skinUrl);
        changeTexture(skinUrl);

        // console.log(json.textures.skin);
        // const img = document.getElementById("skinImg");
        // img.src = "data:image/png;base64," + skin;
    } catch(err) {
        // @todo! Show some UI indicating the error
        console.error(err);
    }
    
}

async function changeTexture(textureUrl) {
    const viewer = document.getElementById("viewer");
    // // console.log(viewer);

    // // viewer.addEventListener("load",async e => {
    const material = viewer.model.materials[0];

    const textureObj =  await viewer.createTexture(textureUrl);
    // // console.log(textureObj);
    material.pbrMetallicRoughness.baseColorTexture.setTexture(textureObj);
    // console.log(material.baseColorTexture);
        
    const scene = viewer[Object.getOwnPropertySymbols(viewer).find(e => e.description === 'scene')];
    // console.log(scene);

    let character;
    scene.traverse((obj) => {
        if (obj.isMesh && obj.name === "Character")
            character = obj;
    });
    // console.log(scene);

    const texture = character.material.map;
    console.log(texture);
    texture.minFilter = 1003; // THREE.NearestFilter
    texture.magFilter = 1003;
    // console.log(scene.traverse(obj => console.log(obj)));

    // });
    // const viewer = BabylonViewer.viewerManager.getViewerById("viewer");
    // const viewer = getMeMyViewer();
    // console.log(viewer.sceneManager.scene)

}

window.onload = main;
