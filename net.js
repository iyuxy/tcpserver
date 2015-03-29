import threading
import socket
from tkinter import *
import sys
import mysql.connector
import time
tlock = threading.RLock()  
global t
localIP = socket.gethostbyname(socket.gethostname())
class pygui (threading.Thread):   #继承父类threading.Thread
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):                   #把要执行的代码写到run函数里面 线程在创建后会直接运行run函数 
        pytkgui()

class pyserial (threading.Thread):   #继承父类threading.Thread
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):                   #把要执行的代码写到run函数里面 线程在创建后会直接运行run函数
        cktx(0)
class pysocket (threading.Thread):   #继承父类threading.Thread
    def __init__(self, threadID, name, counter):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
    def run(self):                   #把要执行的代码写到run函数里面 线程在创建后会直接运行run函数
        connect()
def connect():
    global signal
    signal=True
    serialjc.start()
    global request
    hostname = localIP
    port     =int(8081)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR, 1)
    sock.bind((hostname, port))
    sock.listen(1)
    while True:
              come(sock)
def come(sock):
    request, clientAddress = sock.accept()
    tip = "接收到连接来自PHP"
    infotip.set(tip)
    root.update()
    data = 0
    try:
        data = request.recv(2048).decode()
    except UnicodeDecodeError as e:
            tiperror = "转码错误！请不要发送中文字符"
            infotip.set(tiperror)
            root.update()
    #tlock.acquire()
    if  data=="cardid":
        tlock.acquire()
        global signal
        signal=False
        tlock.release()
        wcmd=''
        #print("nimeiaa")
        #signal = False
        #print(signal)
        #request.close()
        #infoshuju.set(data)
        #root.update()
        #time.sleep(2)
        #print(ckstrs)
        wcmd = cktx(1)
        #infoshuju.set(wcmd)
        #root.update()
        #n=t.write(wcmd)
        request.send(wcmd)
        tip = "PHP读卡成功！此时不可读卡！！"
        infotip.set(tip)
        root.update()
    try:
        zhiling = request.recv(2048).decode()
    except UnicodeDecodeError as e:
            tiperror = "转码错误！请不要发送中文字符"
            infotip.set(tiperror)
            root.update()
    if zhiling !='':
       da = zhiling 
       shuju = da.split('&&')
       if len(shuju) == 2:
           if shuju[0]=="ok":
               wcmd=shuju[1]
               tlock.acquire()
               wcmd=wcmd.encode()
               n=t.write(wcmd)
               signal=True
               tlock.release()
               tip = "操作成功！"
               infotip.set(tip)
               root.update()
               request.close()
def btnclickon():
    btnname.set('断开')
    button["bg"]="red"
    button["command"]=btnclickoff
    tip = "打开连接"
    infotip.set(tip)
    root.update()
    import serial
    port =  inputlabel.get()
    ptl      =  int(inputport.get())
    global t
    t=serial.Serial(port,ptl)
    socketjc.start()
def btnclickoff():
    btnname.set('打开')
    button["bg"]="#0099FF"
    button["command"]=btnclickon
    tip = "断开连接"
    infotip.set(tip)
    root.update()
    signal = False
    #print(signal)
    t.close()
def pytkgui():
    global root
    root = Tk()
    root.title('TOOLs v1.0')
    root.geometry('300x320')
    root.resizable(False, False)
    global serialport
    serialport = StringVar()
    global btnname
    btnname= StringVar()
    global infoshuju
    infoshuju = StringVar()
    global serial
    serial = IntVar()
    global infotip
    infotip = StringVar()
    title = Label(root,text = '健身房管理工具',font='微软雅黑')
    title.place(x=90,y=10)
    label = Label(root,fg='blue',text = '请选择COM口：')
    label.place(x=10,y=50)
    global inputlabel
    inputlabel= Entry(root,textvariable = serialport,width = 20,bg = 'white')
    inputlabel.place(x=100,y=50)
    serialport.set('com2')
    portname= Label(root,fg='blue',text = '请输入波特率：')
    portname.place(x=10,y=90)
    global inputport
    inputport = Entry(root,textvariable = serial,width = 5,bg = 'white')
    inputport.place(x=100,y=90)
    serial.set('9600')
    global button
    button = Button(root,textvariable = btnname,width=12,height=1,bg='#0099FF',fg='white')
    button.place(x=80,y=130)
    btnname.set("打开")
    button["command"]=btnclickon
    info= Label(root,fg='blue',textvariable = infotip,width=40,height=2,bg='white')
    info.place(x=10,y=170)
    global tip
    tip="等待操作！"
    infotip.set(tip)
    infodatatitle = Label(root,fg='red',text="串口接收到的卡号:")
    infodatatitle.place(x=10,y=230)
    infodata= Label(root,fg='blue',textvariable = infoshuju,width=40,height=2,bg='#ffffff')
    infodata.place(x=10,y=255)
    root.mainloop()
def usemysql(ID):
    sconn = mysql.connector.connect(host='localhost', user='root',passwd='password',db='jsf')
    cursor =sconn.cursor()
    query="SELECT * FROM userinfo where cardID =%s"
    infodata=(ID,)
    cursor.execute(query,infodata)
    rows = cursor.fetchall()
    if rows==[]:
       tp0 = "WNS"
       tp0=tp0.encode()
       n=t.write(tp0)
    for row in rows:
        (id,name,sexy,cardID,selfID,lefttimes,permit,email,phonenumber,times) = row
        if  permit=='0':
            tp1 = "WPS"
            tp1=tp1.encode()
            n=t.write(tp1)
            tip = "该卡已挂失！"
            infotip.set(tip)
            root.update() 
        else:
            if lefttimes==0:
                tp2 = "WTS"
                tp2=tp2.encode()
                n=t.write(tp2)
                tip = "余次为0！"
                infotip.set(tip)
                root.update() 
            else:
                thelefttimes=lefttimes-1
                theid=id
                thetimes=times+1
                update="UPDATE  `jsf`.`userinfo` SET  `lefttimes` =  %s,`times` =  %s WHERE  `userinfo`.`id` =%s"
                newdata=(thelefttimes,thetimes,theid)
                cursor.execute(update,newdata)
                date=(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
                insert="INSERT INTO `jsf`.`record` (`id`, `selfID`, `cardID`,`record`, `name`) VALUES (NULL,%s,%s,%s,%s)"
                insertdata=(selfID,cardID,date,name)
                cursor.execute(insert,insertdata)
                cishu=str(thelefttimes)
                if len(cishu)==2:
                    cishu='0'+cishu;
                if len(cishu)==1:
                    cishu='00'+cishu;
                tp3 = "WJ"+cishu+'S'
                tp3 = tp3.encode()
                n=t.write(tp3)
                tip = "刷卡扣次成功！"
                infotip.set(tip)
                root.update()
        #cmd=cardID
        #cmd=cmd.encode()
        #n=t.write(cmd)
def cktx(action):
    #print(t.portstr)
    #tlock.acquire()
    global signal
    if action==0:
            while True:
                tlock.acquire()
                if signal:
                    tlock.release()
                    tlock.acquire()
                    ckstrs = t.read(12)
                    infoshuju.set(ckstrs)
                    root.update()
        #ckstrs="123456789abc"
        #infoshuju.set(ckstrs)
        #root.update()
        #print(ckstrs)
        #ckstrs="123456789abc"
                    tlock.release()
                    time.sleep(0.2)
                    tlock.acquire()
                    if signal==False:
                        a=1
                    else:
                        usemysql(ckstrs)
                tlock.release()
    else:
        tlock.acquire()
        ckstrs = t.read(12)
        infoshuju.set(ckstrs)
        root.update()
        tlock.release()
        return ckstrs
    #tlock.release()
         
    #print(str) 
# 创建新线程
tkgui = pygui(1, "tkgui", 1)
serialjc = pyserial(2, "serial", 2)
socketjc = pysocket(3, "socket", 3)
# 开启线程
tkgui.start()

