import base64
from datetime import datetime
import re
from flask import Flask, flash, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL, MySQLdb
import os
from werkzeug.utils import secure_filename
from flask_mail import Mail

app = Flask(__name__)

app.secret_key = 'admin1234'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'osm'
mysql = MySQL(app)


app.config["MAIL_SERVER"]='smtp.gmail.com'  
app.config["MAIL_PORT"] = 465     
app.config["MAIL_USERNAME"] = 'osmnkc2022@gmail.com'  
app.config['MAIL_PASSWORD'] = 'npavansbvpxsdlbw'  
app.config['MAIL_USE_TLS'] = False  
app.config['MAIL_USE_SSL'] = True  
mail = Mail(app)  


UPLOAD_FOLDER = './static/upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024
ALLOWED_EXTENSIONS = set(['pdf'])


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/add/teacher')
def addteacher():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM teacher")
    data = cursor.fetchall()
    return render_template('addteacher.html', data=data)


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'GET':
        return "Login via the login Form"
    if request.method == 'POST':
        salutations = request.form['salutations']
        name = request.form['name']
        email = request.form['email']
        pswd = request.form['pswd']
        cursor = mysql.connection.cursor()
        cursor.execute(''' INSERT INTO teacher (salutations,name,email, pswd, log_in, log_out) VALUES(%s,%s,%s,%s,%s,%s)''',(salutations,name,email,pswd,datetime.now(), ''))
        mysql.connection.commit()
        
        mail.send_message(
                            sender="osmnkc2022@gmail.com",
                            recipients = [email],
                            subject = "Login Details",
                            body = "Username : " + name + "\n" + "Password : " + pswd
                        )
        flash("Teacher Added Successfully")
        return redirect('/add/teacher')


@app.route('/update', methods=["POST"])
def update():
    id = request.form['id']
    salutations = request.form['salutations']
    name = request.form['name']
    email = request.form['email']
    pswd = request.form['pswd']
    cursor = mysql.connection.cursor()
    cursor.execute("""UPDATE teacher SET salutations=%s,name=%s, email=%s, pswd=%s WHERE id=%s""",(salutations,name, email, pswd, id))
    mysql.connection.commit()
    flash("Teacher updated Successfully")
    return redirect('/add/teacher')


@app.route('/delete/<id>')
def delete(id):
    # id = request.form['id']
    cursor = mysql.connection.cursor()
    cursor.execute("""DELETE FROM teacher where id=%s""", (id,))
    mysql.connection.commit()
    flash("Teacher Deleted Successfully")
    return redirect('/add/teacher')

@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'admin' in request.form and 'pass' in request.form:
        username = request.form['admin']
        password = request.form['pass']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM admin WHERE name = %s AND pwd = %s', (username, password,))
        account = cursor.fetchone()
        if account:
            session['admin_loggedin'] = True
            session['id'] = account['id']
            session['username'] = account['name']
            return redirect('/admin/dashboard')
        else:
            flash("Invalid Username or Password")
    return render_template('admin_login.html')


@app.route('/teacher/login', methods=['GET', 'POST'])
def teacher_login():
    if request.method == 'POST':
        teacher_name = request.form['teacher_name']
        email = request.form['teacher_email']
        password = request.form['pass']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM teacher WHERE name = %s AND email = %s AND pswd = %s', (teacher_name, email, password))
        account = cursor.fetchone()
        cursor.execute('UPDATE teacher SET log_in = %s WHERE name = %s', (datetime.now(),teacher_name))
        mysql.connection.commit()
        if account:
            session['teacher_loggedin'] = True
            session['id'] = account['id']
            session['teacher_name'] = account['name']
            return redirect('/teacher/dashboard')
        else:
            flash('Invalid Teacher Name/Email ID/Password')
    return render_template('teacherlogin.html')

@app.route('/teacher/dashboard', methods=['GET', 'POST'])
def teacherdashboard():
    if session.get('teacher_name') != None:
        var1 = session['teacher_name']
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT subject,course,class_name,count(file_name),file_name FROM assign WHERE name=%s GROUP BY subject",(var1,))
        data = cursor.fetchall()
        cursor.execute("SELECT id,file_name FROM assign where name=%s",(var1,))
        data2 = cursor.fetchall()
        cursor.close()
    else:
        data = ''
    return render_template('teacher_dashboard.html', data=data, data2=data2)

@app.route('/admin/dashboard')
def admindashboard():
    return render_template('admin_dash.html')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
  
@app.route('/admin/dashboard/assign',methods=['GET', 'POST'])
def upload_file():
    cur = mysql.connection.cursor()
    now = datetime.now()
    cur.execute('SELECT name FROM teacher')
    teachers_name = cur.fetchall()
    if request.method == 'POST':
        files = request.files.getlist('files[]')
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                check_path = os.path.dirname(app.config['UPLOAD_FOLDER'])+ '/upload/' +filename
                check_path = check_path[1:]
                name = request.form['teacher_name']
                subject = request.form['subject']
                course = request.form['course']
                class_name = request.form['class_name']
                cur.execute("INSERT INTO assign (file_name,uploaded_on, name, subject, course, class_name) VALUES (%s, %s,%s, %s, %s, %s)", [check_path,now,name, subject,course, class_name])
                mysql.connection.commit()
            else:
                flash("File can't be uploaded")
                break
        cur.close()
    return render_template('assign.html',teacher_name = teachers_name)
 
@app.route("/logout", methods=['GET', 'POST'])
def logout():
    cursor = mysql.connection.cursor()
    if session.get('teacher_name') != None:
        teacher_name = session['teacher_name']
    if session.get('username') != None and session.get('admin_loggedin') != False:
        session.pop('username',None)
        session['admin_loggedin'] = False
    elif session.get('teacher_name') != None and session.get('teacher_loggedin') != False:
        session.pop('teacher_name',None)
        session['teacher_loggedin'] = False
        cursor.execute('UPDATE teacher SET log_out = %s WHERE name = %s', (datetime.now(),teacher_name))
        mysql.connection.commit()
    return redirect(url_for("home"))


@app.route('/teacher/paper/<id>')
def papercheck(id):
    if session.get('teacher_name') != None:
        var2 = session['teacher_name']
        # var3 = session['subject']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        # cursor = mysql.connector.connect(host="localhost",user="root",password="",database="osm")
        cursor.execute("SELECT id,file_name FROM assign WHERE id=%s AND name=%s",(id,var2,))
        path = cursor.fetchone()
        cursor.execute("SELECT file_name FROM assign WHERE id=%s AND name=%s",(id,var2,))
        pathh = cursor.fetchone()
        pathh["file_name"] = re.sub("^/","",pathh["file_name"])
        cursor.close()
        with open(pathh["file_name"], "rb") as f:
            pdf_file = f.read()
            pdf_base64 = base64.b64encode(pdf_file).decode('utf-8')
        
    return render_template("display.html",path=path,pathh=pathh,pdf_base64=pdf_base64)


@app.route('/teacher/paper_display/<id>')
def disp(id):
    if session.get('teacher_name') != None:
        var2 = session['teacher_name']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT file_name FROM assign WHERE id=%s AND name=%s",(id,var2,))
        pathh = cursor.fetchone()
        cursor.close()
        with open(str(pathh.file_name), "rb") as f:
            pdf_file = f.read()
            pdf_base64 = base64.b64encode(pdf_file).decode('utf-8')
    return render_template("display.html", pathh=pathh,pdf_base64=pdf_base64)


@app.route("/admin/dashboard/history")
def history():
    if session.get('username') != None:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM teacher")
        history = cursor.fetchall()
    return render_template("history.html", history = history)


@app.route("/teacher/reset_password",methods=['GET', 'POST'])
def reset_password():
    
    # account = 0
    if request.method == 'POST':
        reset_email = request.form['reset_email']
        pswd = request.form['reset_pswd']
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT email FROM teacher WHERE email=%s', (reset_email,))
        account = cursor.fetchone()
        cursor.execute("UPDATE teacher SET pswd=%s WHERE email=%s", (pswd,reset_email))
        mysql.connection.commit()  
        if account:
            session['reset_email'] = account
            mail.send_message(
                            sender="osmnkc2022@gmail.com",
                            recipients = [reset_email],
                            subject = "Reset Details",
                            body =  "Your new Password  is : " + pswd
                        )
            return redirect('/teacher/login')
        else:
            flash('Invalid Email Id')
    

        
        
    
    return render_template('reset_request.html',title="Request",request=request)

if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.run(debug=True)
