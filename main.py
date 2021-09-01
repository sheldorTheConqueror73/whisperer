import sys

def help():
    return  None

def check():
    return None

def get():
    return None

def main():
    args=sys.argv
    if len(args) == 1:
        help()
    elif len(args) == 2:
        if args[1] == 'check':
            check()
        elif args[1] == "get":
            get()


