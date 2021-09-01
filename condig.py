import input
from installer import Evn
from configparser import ConfigParser

config = ConfigParser()


def config():
    mail = input.input_handler("Enter email address: ", 2)
    msg = '''
    How often do you want to check for a new issue?
    0 Every day
    1 Once a month
    2 Manually check (use $whisperer check)
    
    '''
    freq = input.input_handler(msg, 1)
    override=input.input_handler("Override old issues with new ones? Y/N")

    config['settings'] = {
        'addr': mail,
        'freq': freq,
        'override': override,
        'current': -1
    }
    with open(Evn.File, 'wb') as file:
        config.write(file)
    #init main

