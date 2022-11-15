def pre_request(worker, req):
    if req.path == '/products/health' and req.method == 'GET':
        # skip logging health checks
        return
    worker.log.debug("%s %s" % (req.method, req.path))
