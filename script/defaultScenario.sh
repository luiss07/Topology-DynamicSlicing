#!/bin/bash

#reset previous configuration, this is done to avoid errors
#bash ./script/resetScenario.sh
# S1
echo ' ---------------------------------------------- '
echo '*** Network Slicing: Creating 1 slice of 10 Mbps ...'
echo 'Switch 1:'
sudo ovs-vsctl -- \
set port s1-eth1 qos=@newqos -- \
--id=@newqos create QoS type=linux-htb \
other-config:max-rate=10000 \
queues:123=@1q -- \
--id=@1q create queue other-config:min-rate=1000 other-config:max-rate=10000 -- \

# S3
echo 'Switch 2:'
sudo ovs-vsctl -- \
set port s2-eth1 qos=@newqos -- \
--id=@newqos create QoS type=linux-htb \
other-config:max-rate=10000 \

# S3
echo 'Switch 3:'
sudo ovs-vsctl -- \
set port s3-eth1 qos=@newqos -- \
--id=@newqos create QoS type=linux-htb \
other-config:max-rate=10000 \
queues:123=@1q -- \
--id=@1q create queue other-config:min-rate=1000 other-config:max-rate=10000 -- \

echo '*** Slices Created!'
echo ' ---------------------------------------------- '

# [SWITCH 1]
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=3,idle_timeout=0,actions=set_queue:123,output:2
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=2,idle_timeout=0,actions=set_queue:123,output:3
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=1,idle_timeout=0,actions=drop
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=4,idle_timeout=0,actions=drop
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=5,idle_timeout=0,actions=drop
sudo ovs-ofctl add-flow s1 ip,priority=65500,in_port=6,idle_timeout=0,actions=drop

# [SWITCH 2]
sudo ovs-ofctl add-flow s2 ip,priority=65500,in_port=1,idle_timeout=0,actions=drop
sudo ovs-ofctl add-flow s2 ip,priority=65500,in_port=2,idle_timeout=0,actions=drop

# [SWITCH 3]
sudo ovs-ofctl add-flow s3 ip,priority=65500,in_port=2,idle_timeout=0,actions=set_queue:123,output:1,output:3
sudo ovs-ofctl add-flow s3 ip,priority=65500,in_port=3,idle_timeout=0,actions=set_queue:123,output:1,output:2
sudo ovs-ofctl add-flow s3 ip,priority=65500,in_port=1,idle_timeout=0,actions=set_queue:123,output:2,output:3
