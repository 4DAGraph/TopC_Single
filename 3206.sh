while :
do
  #sleep 10000
  ProcNumber=`ps -ef | grep 'node /home/administrator/mike/newmike/TungServer/index.js 6 32000' | grep -v 'grep' | wc -l`
  if [ $ProcNumber -eq 0 ];then
     nohup node /home/administrator/mike/newmike/TungServer/index.js 6 32000 1 http://192.168.51.203:9999 &
     #echo 0
  fi
  ProcNumber=`ps -ef | grep 'index.js 1 3206 1' | grep -v 'grep' | wc -l`
  if [ $ProcNumber -eq 0 ];then
     nohup node /home/administrator/mike/newmike/TungServer/index.js 1 3206 1 https://mainnet.infura.io/ &
     #echo 0
  fi
done
