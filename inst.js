let profileName = 'fullychargeduk';
async function getInstagramPictures (profileName) {
    const baseUrl = "https://www.instagram.com";
    const profileUrl = `${baseUrl}/${profileName}`;
    const jsonDataUrl = `${profileUrl}/?__a=1`;

    const response = await fetch(jsonDataUrl);
    const jsonData = await response.json();
    const edges = jsonData.graphql.user.edge_owner_to_timeline_media.edges;

   const pictures =  edges.map(({ node }) => ({
        url: `https://www.instagram.com/p/${node.shortcode}/`,
        thumbnailUrl: node.thumbnail_src,
        displayUrl: node.display_url,
        caption: node.edge_media_to_caption.edges[0].node.text
    }))
    if (response.ok) {
        return pictures;
    } else {
        throw new Error(pictures);
    }
}

getInstagramPictures(profileName)
    .then(photos => {
        const container = document.getElementById('instagram-photos');
        const ul = document.createElement('ul');
        photos.forEach(el => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const img = document.createElement('img')

            a.setAttribute('href', el.url)
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
            a.classList.add('instagram-photo')

            img.setAttribute('src', el.thumbnailUrl)
            img.setAttribute('alt', el.caption)

            a.appendChild(img)
            li.appendChild(a);
            ul.appendChild(li);

        })
        container.appendChild(ul);
    })
    .catch(error => console.error("Error:", error));