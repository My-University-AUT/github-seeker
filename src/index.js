function getProfileData(username) {
    const xmlHttp = new XMLHttpRequest();
    const theUrl = `https://api.github.com/users/${username}`
    try {
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);

        const parsedResult = JSON.parse(xmlHttp.responseText)

        const result = {
            username: parsedResult.login,
            avatar: parsedResult.avatar_url,
            fullName: parsedResult.name,
            location: parsedResult.location,
            bio: parsedResult.bio,
            blog: parsedResult.blog
        }
        console.log(result);
        return result
    } catch(err) {
        $("#error-div").text("Server error!!")
        $("#error-div").removeClass("d-hide")
    }
}

function setProfileData(data) {
    const username = data.username || "Github user"
    const bio = data.bio || "Nothing written yet"
    const location = data.location || "everywhere on the earth"
    const fullName = data.fullName || "Github user"
    // TODO: add my avatar assets
    const avatar = data.avatar || "./src/assets/profile.jpg"
    const blog = data.blog || "github.com"

    // todo
    // $('#github-username')
    console.log(bio)
    $('#github-fullname').text(fullName)
    $('#github-bio').text(bio)
    $('#github-location').text(location)
    $('#github-blog').text(blog)
    $('#github-profile').attr("src", avatar);
}

function getFromStorage(username) {
    const stringifiedResult = window.localStorage.getItem(username)
    if (!stringifiedResult) {
        return undefined
    }
    const parsedResult = JSON.parse(stringifiedResult)
    return parsedResult
}

function setInStorage(username, value) {
    window.localStorage.setItem(username, value)
}

const data = getProfileData("alinowrouzii")
setProfileData(data)


$("#submit-btn").click(function () {
    const eneteredUsername = $("#username-textarea").val()
    $("#username-textarea").val("")

    let data = getFromStorage(eneteredUsername)
    console.log("here is data from storage", eneteredUsername, data)
    if(!data) {
        // if data not exist in storage
        data = getProfileData(eneteredUsername)
        console.log("here is data from api", eneteredUsername, data)
    }
    if(!data.username){
        // show user not found to user
        $("#error-div").text("User not Found!")
        $("#error-div").removeClass("d-hide")
        console.log("not found!!")
        return
    }
    const stringifiedResult = JSON.stringify(data)
    setInStorage(eneteredUsername, stringifiedResult)
    $("#error-div").addClass("d-hide")
    setProfileData(data)
});