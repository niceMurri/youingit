const form = document.querySelector('#form')

const inputUser = document.querySelector('#git-user')

//get elements

const sectionPerfilInfo = document.querySelector('.perfil-info')
const perfilImg = document.querySelector('.perfil-img img');
const perfilName = document.querySelector('.perfil-img figcaption');


//follow and bio
let linkFollowers;
let numberFollowers;

let linkFollowing;
let numberFollowing;

let bio;

//followers list
let followersList;

//following list
let followingList;

//social media
let git;
let twitter;
let email;


class myPerfilGit {
    constructor(form) {
        this.form = form
        this.init()
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this))
    }

    handleSubmit(e) {
        e.preventDefault()

        //user
        const user = inputUser.value

        //validate field
        if (!user) return alert('fill in the field')

        //perfilJSON
        this.perfilJSON(user)
    }

    async perfilJSON(user) {
        try {
            const userInfo = await fetch(`https://api.github.com/users/${user}`)
            const status = String(userInfo.status);
            
            if(status[0] !== '2') throw 'erro';

            const userJSON = await userInfo.json()

            this.loadUser(userJSON)
        } catch (error) {
            sectionPerfilInfo.innerText = ''

            //remove img perfil and name
            perfilImg.setAttribute('src', 'src/img/blank-perfil.jpg');
            perfilImg.setAttribute('alt', 'Blank photo');
            perfilName.innerText = 'Unknow';
            
            //create msg error
            const p = document.createElement('p');
            p.innerText = 'User not exists'
            p.classList.add('error')

            sectionPerfilInfo.appendChild(p);
        }
    }

    async loadUser(userJSON) {
        perfilImg.setAttribute('src',userJSON.avatar_url)
        perfilImg.setAttribute('alt', 'Foto de ' + userJSON.login);

        perfilName.innerText = userJSON.login;
        
        await this.loadPage();
        
        //followers
        linkFollowers.setAttribute('href', `https://github.com/${userJSON.login}?tab=followers`);
        numberFollowers.innerText = userJSON.followers;
        
        //following
        linkFollowing.setAttribute('href', `https://github.com/${userJSON.login}?tab=following`);
        numberFollowing.innerText = userJSON.following;

        //bio
        bio.innerText = userJSON.bio ? userJSON.bio : 'nothing in bio.';

        //folowersList
        this.loadFollow(followersList,userJSON.followers_url);

        //followingList
        this.loadFollow(followingList,`https://api.github.com/users/${userJSON.login}/following`);

        //socialmedia
        git.setAttribute('href', `https://github.com/${userJSON.login}`);

        twitter.setAttribute('href', `https://twitter.com/${userJSON.twitter_username}`);

        email.setAttribute('href', `emailto:${userJSON.email}`);

    }
    async loadPage(){
        const page = await fetch('section.html');
        const pageHTML = await page.text();

        //load page
        sectionPerfilInfo.innerHTML = pageHTML;

        //followers
        linkFollowers = document.querySelector('.followers');
        numberFollowers = linkFollowers.querySelector('.number-followers');

        //following
        linkFollowing = document.querySelector('.following');
        numberFollowing = linkFollowing.querySelector('.number-following');

        //bio
        bio = document.querySelector('#bio');

        //followersList
        followersList = document.querySelector('.followers-list');

        //followingList
        followingList = document.querySelector('.following-list');

        //socialmedia;
        git = document.querySelector('.git');
        twitter = document.querySelector('.twitter');
        email = document.querySelector('.email');
    }

    async loadFollow(listElement, url){
        listElement.innerText = '';

        try {
            const follow = await (await fetch(url)).json();
            
            for(const user of follow){
                listElement.innerHTML += `
                <li>
                    <a href="https://github.com/${user.login}" target="_blank">
                        <img src="${user.avatar_url}" alt="foto de ${user.login}" width="20px">
                    </a>
                </li>`
            }
            

        } catch (erro) {
            console.error(erro)
        }

    }
}

const yourInGit = new myPerfilGit(form);
