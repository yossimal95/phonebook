Vue.component('main-app', {
    template: `<div class="main-app">
        <div class="title">אלפון</div>
        <div class="input-container">
            <span class="date" dir="rtl">מעודכן לתאריך **/**</span>
            <input ref="input" placeholder="חפש שם.." type="text" class="input-search" @input="(e)=>{onInput(e.target.value)}" />
        </div>
        <list-container class="list-container" v-bind:contacts-arr="contacts"></list-container>
    </div>`,
    data: function() {
        return {
            contacts: []
        }
    },
    methods: {
        onInput: function(str) {
            if (str.trim() == '' || str == null) {
                return this.contacts = [];
            }
            return this.contacts = db.filter((item) => { return item["name"].toLocaleLowerCase().indexOf(str.toLocaleLowerCase().trim()) > -1 })
        }
    },
    mounted : function() {
        this.$refs.input.focus();
    }
})

Vue.component('list-container', {
    props: ['contactsArr'],
    template: `<div>
    <list-itme v-for="contact in contactsArr" :name="contact.name" :tel="contact.tel" :email="contact.email" ></list-itme>
    </div>`,
    data: function() {
        return {
           contactsItems: this.contactsarr
        }
    },
    methods: {
        
    }
})


Vue.component('list-itme', {
    props: ['name', 'tel', 'email'],
    template: `<div class="list-item">
        <span class="name" @click="toggleWindow()">{{name}}</span>
        <a class="tel" :href="getTel(tel)" target="_blank">{{tel}}</a>
        <item-window v-if="showWindow" @close="toggleWindow" :name="name" :tel="tel" :email="email"></item-window>
    </div>`,
    data() {
        return {
           showWindow: false
        }
    },
    methods: {
        getTel(str) {
            return 'tel:' + str.replace('-','');
        },
        toggleWindow() {
            return this.showWindow = !this.showWindow;
        }
    }
})

Vue.component('item-window', {
    props: ['name', 'tel', 'email'],
    template: `<div class="item-window" @click="closeWindow()">
        <div class="board" @click="(e)=>{e.stopPropagation();}">
            <div class="avatar"></div>
            <span class="avatar-name">{{name}}</span>

            <link-itme v-if="tel != ''" title="טלפון" :key-name="tel" :value="getTel(tel)" @click-action="showTheCopy"></link-itme>
            <link-itme v-if="email != '' && email != null" title="אימייל" :key-name="email" :value="getEmail(email)" @click-action="showTheCopy"></link-itme>

            <a v-if="tel != ''" class="whatsapp" :href="whatsappLink(tel)" target="_blank"></a>

        </div>
        <div class="close" @click="closeWindow()"></div>
        <div v-show="showCopy" class="copied">הועתק!</div>
    </div>`,
    data() {
        return {
           showCopy: false
        }
    },
    methods: {
        getTel(str) {
            return 'tel:' + str.replace('-','');
        },       
        getEmail(str) {
            return 'mailto:' + str;
        },
        showTheCopy() {
            this.showCopy = true;
            setTimeout(()=> {this.showCopy = false}, 1000);
        },
        closeWindow() {
            this.$emit('close');
        },
        whatsappLink(num) {
            return 'https://wa.me/972' + num.replace('-','').substring(1,num.length);
        }
    }
})

Vue.component('link-itme', {
    props: ['title', 'keyName', 'value'],
    template: `
    <div class="link-itme">
        <span class="copy-btn" @click="copy(value)"></span>
        <div>
            <span @click="copy(keyName)">{{title}}:</span>
            <a :href="value" target="_blank">
            {{keyName}}
            </a>
        </div>
    </div>`,
    data() {
        return {
           
        }
    },
    methods: {
        copy(textToCopy) {
            let input = document.createElement('input');
            input.setAttribute('value', textToCopy);
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            this.$emit('click-action');
        }
    }
})

new Vue({ el: '#app' })