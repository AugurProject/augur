  domain            = "${var.environment}.${var.domain}"
  origin_domain     =
module "origin" {
  source     = "git::https://github.com/cloudposse/terraform-aws-s3-website.git?ref=tags/0.5.1"
  namespace  = var.namespace
  stage      = var.environment
  name       = var.name

  hostname             = "origin.${var.environment}.${var.domain}"
  parent_zone_name     = var.domain
  cors_allowed_headers = ["*"]
  cors_allowed_methods = ["GET", "HEAD"]
  cors_allowed_origins = ["*"]
  cors_max_age_seconds = "3600"
  cors_expose_headers  = ["ETag"]
  deployment_arn       = var.ci_arn
}

module "cdn" {
  source     = "git::https://github.com/cloudposse/terraform-aws-cloudfront-cdn.git?ref=tags/0.4.0"
  namespace  = var.namespace
  stage      = var.environment
  name       = var.name

  aliases                = [var.domain]
  origin_domain_name     = module.origin.s3_bucket_domain_name
  origin_protocol_policy = "http-only"
  parent_zone_name       = var.domain
  acm_certificate_arn    = var.certificate_arn
  forward_cookies        = "none"
  forward_headers        = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
  default_ttl            = 86400
  min_ttl                = 0
  max_ttl                = 86400
  compress               = "true"
  cached_methods         = ["GET", "HEAD"]
  allowed_methods        = ["GET", "HEAD", "OPTIONS"]
  price_class            = "PriceClass_All"
}
