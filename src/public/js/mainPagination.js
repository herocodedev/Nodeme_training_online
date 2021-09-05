/* Phan Trang b1+b2
// var current_page = 1;
// function renderBtn() {
//     $.ajax({
//             url: '/user',
//             type: 'GET'
//         })
//         .then(users => {
//             var paginationBtn = $('.btn')
//             for (let i = 1; i <= users.total; i++) {
//                 paginationBtn.append(`
//                 <li class="page-item"><a class="page-link" href="#" onclick="loadPage(${i})">${i}</a></li>
//                 `)
//             }
//         })
// }
// renderBtn()
// function loadPage(page) {
//     $.ajax({
//             url: '/user?page=' + page,
//             type: 'GET'
//         })
//         .then(users => {
//             const user = document.querySelector('.user')

//             var html = users.data.map(el => {
//                 return `
//                     <h1>Username: ${el.username}</h1>
//                     <p>Password:${el.password}</p>
//                 `
//             }).join('')

//             user.innerHTML = html
//         })
//         .catch(err => console.log(err))

// }

// function nextPage() {
//     current_page++;
//     $.ajax({
//             url: '/user?page=' + current_page,
//             type: 'GET'
//         })
//         .then(users => {
//             const user = document.querySelector('.user')

//             var html = users.data.map(el => {
//                 return `
//                 <h1>Username: ${el.username}</h1>
//                 <p>Password:${el.password}</p>
//             `
//             }).join('')

//             user.innerHTML = html
//         })
//         .catch(err => console.log(err))
// }

// function prevPage() {
//     if (current_page > 1) {
//         current_page--;
//     } else {
//         current_page = 1
//     }
//     $.ajax({
//             url: '/user?page=' + current_page,
//             type: 'GET'
//         })
//         .then(users => {
//             const user = document.querySelector('.user')

//             var html = users.data.map(el => {
//                 return `
//                 <h1>Username: ${el.username}</h1>
//                 <p>Password:${el.password}</p>
//             `
//             }).join('')

//             user.innerHTML = html
//         })
//         .catch(err => console.log(err))
// }
*/

/* Phan Trang bai 3 */
// Dùng Thư VIện
$('#page-btn').pagination({
    dataSource: '/user',
    locator: 'data',
    totalNumberLocator: function(response) {
        // So phan tu trong array
        return response.NumberEl
    },
    pageSize: 2,
    showGoInput: true,
    showGoButton: true,
    afterPageOnClick: function(event, pageNumber) {
        loadPage(pageNumber)
    },
    afterNextOnClick: function(event, pageNumber) {
        loadPage(pageNumber)
    },
    afterPreviousOnClick: function(event, pageNumber) {
        loadPage(pageNumber)
    },
    afterGoButtonOnClick: function(event, pageNumber) {
        console.log(pageNumber)
        loadPage(pageNumber)
    },
    afterGoInputOnEnter: function(event, pageNumber) {
        loadPage(pageNumber)
    }


})

function loadPage(page) {
    $.ajax({
            url: '/user?page=' + page,
            type: 'GET'
        })
        .then(users => {
            const user = document.querySelector('.user')
            var html = users.data.map(el => {
                return `
                    <h1>Username: ${el.username}</h1>
                    <p>Password:${el.password}</p>
                `
            }).join('')

            user.innerHTML = html
        })
        .catch(err => console.log(err))
}
loadPage(1)