from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import mysql.connector
import re
import json

app = Flask(__name__)


app.secret_key = 'your secret key' #!!! see if this is decided on earlier in tutorial


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ""
app.config['MYSQL_DB'] = 'users'#'user_accts'

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
	connection = mysql.connector.connect(
		host="localhost",
		user="root",
		password="MYsql!Pass1",
		database="users"
	)
	msg = ''
	if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
		username = request.form['username']
		password = request.form['password']
		cursor = connection.cursor()
		cursor.execute(
			'SELECT * FROM user_accts WHERE username = %s \
			AND password = %s', (username, password, ))
		account = cursor.fetchone()
		if account:
			session['loggedin'] = True
			session['id'] = account[0]
			#session['id'] = account['id']
			session['username'] = account[1]
			#session['username'] = account['username']
			msg = 'Logged in successfully!'
			return render_template('index.html', msg=msg)
		else:
			msg = 'Incorrect username or password!'
	connection.close()
	return render_template('login.html', msg=msg)


@app.route('/logout')
def logout():
	session.pop('loggedin', None)
	session.pop('id', None)
	session.pop('username', None)
	return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
	connection = mysql.connector.connect(
		host="localhost",
		user="root",
		password="MYsql!Pass1",
		database="users"
	)
	msg = ''
	if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form and 'address' in request.form and 'city' in request.form and 'country' in request.form and 'postalcode' in request.form and 'organization' in request.form:
		username = request.form['username']
		password = request.form['password']
		email = request.form['email']
		organization = request.form['organization']
		address = request.form['address']
		if 'city' in request.form:
			city = request.form['city']
		else:
			city = ''
		if 'state' in request.form:
			state = request.form['state']
		else:
			state = ''
		country = request.form['country']
		postalcode = request.form['postalcode']
		cursor = connection.cursor()
		cursor.execute(
			'SELECT * FROM accounts WHERE username = %s', (username, ))
		account = cursor.fetchone()
		if account:
			msg = 'Account already exists!'
		elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
			msg = 'Invalid email address!'
		elif not re.match(r'[A-Za-z0-9]+', username):
			msg = 'Name may only contain characters and numbers!'
		else:
			cursor.execute('INSERT INTO user_accts (username, password, email, organization, address, city, state, country, postalcode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (username, password, email, organization, address, city, state, country, postalcode))

			connection.commit()
			"""
			cursor.execute('INSERT INTO accounts VALUES \
			(NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (username, password, email, organization, address, city, state, country, postalcode, ))
			"""
			msg = 'You have successfully registered!'
	elif request.method == 'POST':
		msg = 'Please fill out the form!'
	connection.close()
	return render_template('register.html', msg=msg)


@app.route("/index")
def index():
	if 'loggedin' in session:
		return render_template("index.html")
	return redirect(url_for('login'))


@app.route("/display")
def display():
	connection = mysql.connector.connect(
		host="localhost",
		user="root",
		password="MYsql!Pass1",
		database="users"
	)
	if 'loggedin' in session:
		cursor = connection.cursor()
		cursor.execute('SELECT * FROM user_accts WHERE id = %s',
			(session['id'], ))
		#SELECT * FROM accounts WHERE id = %s, and session['id'] instead
		account = cursor.fetchone()
		return render_template("display.html", account=account)
	else:
		return "Not logged in\n"
	connection.close()
	return
	#return redirect(url_for('login'))


@app.route("/userlist", methods=['GET'])
def userlist():
	connection = mysql.connector.connect(
		host="localhost",
		user="root",
		password="MYsql!Pass1",
		database="users"
	)
	cursor = connection.cursor()
	cursor.execute('SELECT * FROM user_accts')
	all_cursor = cursor.fetchall()
	all_accts = cursor.description #is this necessary?

	columns = []
	for i in all_accts:
		columns.append(i[0])
	
	jsondata = []
	for n in all_cursor:
		temp = {}
		for z in range(len(columns)):
			temp[columns[z]] = n[z]
		jsondata.append(temp)
	connection.close()
	return jsonify(jsondata)
	#implement to return JSON object of users (list of users, not jst one)
	#react code @ frontend should
	#make sure this works w wget first before react business
	#wget http://localhost:5000/userlist


@app.route("/update", methods=['GET', 'POST'])
def update():
	msg = ''
	connection = mysql.connector.connect(
		host="localhost",
		user="root",
		password="MYsql!Pass1",
		database="users"
	)
	if 'loggedin' in session:
		if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form and 'address' in request.form and 'city' in request.form and 'country' in request.form and 'postalcode' in request.form and 'organization' in request.form:
			username = request.form['username']
			password = request.form['password']
			email = request.form['email']
			organization = request.form['organization']
			address = request.form['address']
			if 'city' in request.form:
				city = request.form['city']
			else:
				city = ''
			if 'state' in request.form:
				state = request.form['state']
			else:
				state = ''
			country = request.form['country']
			postalcode = request.form['postalcode']
			cursor = connection.cursor()
			cursor.execute(
				'SELECT * FROM user_accts WHERE username = %s', (username, ))
			account = cursor.fetchone()
			if account:
				msg = 'Account already exists!'
			elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
				msg = 'Invalid email address!'
			elif not re.match(r'[A-Za-z0-9]+', username):
				msg = 'Name may only contain characters and numbers!'
			else:
				cursor.execute('UPDATE user_accts SET username = %s, password = %s, email = %s, organization = %s, \
					address = %s, city = %s, state = %s, \
					country = %s, postalcode = %s, WHERE id = %s', (
						username, password, email, organization, address, city, state, country, postalcode, (session['id']), ))
				#UPDATE accounts SET username...WHERE id
				connection.commit()
				msg = 'You have successfully updated your account information!'
		elif request.method == 'POST':
			msg = 'Please fill out the form!'
		return render_template("update.html", msg=msg)
	connection.close()
	return redirect(url_for('login'))


if __name__ == "__main__":
	app.run(host="localhost", port=int("5000"))
