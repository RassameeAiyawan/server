let express = require('express')
let app = express()
let mysql = require('mysql')
let bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.set('view engine','ejs')

//-------------เปิดหน้าเว็บ Login----------------
app.get('/login',(req,res)=>{
    res.render('login')
})

//----------------เปิดหน้าฟอร์มลงทะเบียน--------------
app.get('/register',(req,res)=>{
    res.render('register')
})

//-----------------เชื่อมต่อฐานข้อมูล-----------------
const connect = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '12345678',
    database : 'roomdb'
})
connect.getConnection((err,connection)=>{
    if(connection) console.log('เชื่อมต่อฐานข้อมูลสำเร็จ')
})

//-------------ทดสอบการทำงานของ Server------------

app.listen(3000,()=>{
    console.log('Server Start on port 3000')
})

//-----------ทดลองหน้าแรก-----------
app.get('/',(req,res)=>{
    res.send('ยินดีต้อนรับเข้าสู่ NodeJS')
})

// app.get('/name',(req,res)=>{
//     res.send('รัศมี อัยวรรณ์')
// })

//-----------การเพิ่มข้อมูลลงในตาราง---------
app.post('/adddata',(req,res)=>{
    connect.getConnection((err,connection)=>{
        if(err) throw err
        const params = req.body

        connection.query('INSERT INTO `member` set ?',params,(err,rows)=>{
            connection.release
            if(!err){
                res.send(`เพิ่มข้อมูลสำเร็จ`)
            }else{
                console.log(err)
            }
        })
    })
})


//--------------การแสดงผลข้อมูลทั้งหมด---------------

app.get('/showdata',(req,res)=>{
    connect.getConnection((err,connection)=>{
        if(err) throw err
        console.log('Connected id : ?',connection.threadId)

        connection.query('SELECT * FROM `member`',(err,rows)=>{
            connection.release()
            if(!err){
                // console.log(rows)
                // res.send(rows)
                member_obj = {member:rows,error:err}
                res.render('showdata',member_obj)
            }else{
                console.log(err)
            }
        })
    })
})


//-----------การแสดงผลข้อมูลเฉพาะคน-----------------
app.get('/showid/:memid',(req,res)=>{
    connect.getConnection((err,connection)=>{
        if(err) throw err
        console.log('Connected id : ?',connection.threadId)

        connection.query('SELECT * FROM `member` where memid = ?',req.params.memid,(err,rows)=>{
            connection.release()
            if(!err){
                console.log(rows)
                res.send(rows)
            }else{
                console.log(err)
            }
        })
    })
})


//-------------------การแก้ไขข้อมูล-----------
app.put('/updatedata',(req,res)=>{
    connect.getConnection((err,connection)=>{
        if(err) throw err
        console.log('Connected id : ?',connection.threadId)

        const {memid,username,password,fullname,major,phone,email,address}= req.body

        connection.query('UPDATE `member` SET username=?,password=?,fullname=?,major=?,phone=?,email=?,address=? where memid=?',[username,password,fullname,major,phone,email,address,memid],(err,rows)=>{
            connection.release()
            if(!err){
                res.send(`${username}is Complete to Update`)
            }else{
                console.log(err)
            }
        })
    })
})

//---------------การลบข้อมูล---------------
app.delete('/deletedata/:memid',(req,res)=>{
    connect.getConnection((err,connection)=>{
        if(err) throw err
        console.log('Connected id : ?',connection.threadId)

        connection.query('DELETE FROM `member` where memid = ?',req.params.memid,(err,rows)=>{
            connection.release()
            if(!err){
                res.send(`${req.params.memid}is Complete Delete Data in Table`)
            }else{
                console.log(err)
            }
        })
    })
})



module.exports = app;