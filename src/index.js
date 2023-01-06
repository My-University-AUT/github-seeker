/*
    function below will getThe username and 
    call the github api to fetch the user data.
    if user does not exist, the result will
    be undefined
*/
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
    } catch (err) {
        setInnerHtml("error-div", "Server error!!")
        document.getElementById("error-div").classList.remove("d-hide")
    }
}

/*
    set profile data using fetched data
    from getProfileData
*/
function setProfileData(data) {
    const username = data.username || "Github user"
    const bio = data.bio || "Nothing written yet"
    const location = data.location || "everywhere on the earth"
    const fullName = data.fullName || "Github user"
    const avatar = data.avatar || "./src/assets/profile.jpg"
    const blog = data.blog || "github.com"

    console.log(bio)

    setInnerHtml('github-fullname', fullName)
    setInnerHtml('github-bio', bio)
    setInnerHtml('github-location', location)
    setInnerHtml('github-blog', blog)
    document.getElementById("github-profile").src = avatar
}

function setInnerHtml(tagId, content) {
    const element = document.getElementById(tagId)
    element.innerHTML = content
}

/* 
    simply get data form storage
    and using json.parse converts string
    to js object
*/
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

/*
    this function use the get all
    repo url. and aggregate and sort the result
    to show the most popular language.
    This result is shown only
    on the console
*/
function getFavoriteLanguages(username) {
    const xmlHttp = new XMLHttpRequest();
    const theUrl = `https://api.github.com/users/${username}/repos`
    try {
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);

        const parsedResult = JSON.parse(xmlHttp.responseText)
        result = {}
        for (repo of parsedResult) {
            const language = repo.language
            if (language in result) {
                result[language]++
            } else {
                result[language] = 1
            }
            delete result[null]
        }
        const finalResult = Object.entries(result)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        console.log("parsed result", result)
        console.log("here is the most favorite languages", Object.keys(finalResult))
        return Object.keys(finalResult)
    }
    catch (err) {
        console.log(err)
        return []
    }
}
// const shit = getFavoriteLanguages("alinowrouzii")

// const data = getProfileData("alinowrouzii")
// setProfileData(data)

/* 
    listen on click event from submit btn
    to show user data
*/
document.getElementById("submit-btn").addEventListener("click", function () {
    const userNameTextarea = document.getElementById("username-textarea")
    const eneteredUsername = userNameTextarea.value
    userNameTextarea.value = ""


    let data = getFromStorage(eneteredUsername)
    console.log("here is data from storage", eneteredUsername, data)
    if (!data) {
        // if data not exist in storage
        data = getProfileData(eneteredUsername)
        console.log("here is data from api", eneteredUsername, data)
    }
    if(!data) return

    if (!data.username) {
        // show user not found to user
        setInnerHtml("error-div", "User not Found!")
        document.getElementById("error-div").classList.remove("d-hide")
        console.log("not found!!")
        return
    }
    getFavoriteLanguages(eneteredUsername)
    const stringifiedResult = JSON.stringify(data)
    setInStorage(eneteredUsername, stringifiedResult)
    document.getElementById("error-div").classList.add("d-hide")
    setProfileData(data)
});