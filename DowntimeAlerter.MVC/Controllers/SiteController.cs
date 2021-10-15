using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Core.Utilities;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.MVC.DTO;
using DowntimeAlerter.MVC.Validators;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class SiteController : Controller
    {
        private readonly ILogger<SiteController> _logger;
        private readonly IMapper _mapper;
        private readonly ISiteEmailService _siteEmailService;
        private readonly ISiteService _siteService;

        public SiteController(ISiteService siteService, ISiteEmailService siteEmailService, IMapper mapper,
            ILogger<SiteController> logger)
        {
            _mapper = mapper;
            _siteService = siteService;
            _siteEmailService = siteEmailService;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AddSite()
        {
            return View();
        }

        public async Task<IActionResult> EditSite(int id)
        {
            var siteDTO = new SiteDTO();
            try
            {
                if (id <= 0) return BadRequest();
                var site = await _siteService.GetSiteById(id);
                if (site == null) return NotFound();
                var siteEmails = await _siteEmailService.GetSiteEmailsBySiteId(id);
                siteDTO = _mapper.Map<Site, SiteDTO>(site);
                var siteEmailDTO = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
                siteDTO.SiteEmails = siteEmailDTO;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return View(siteDTO);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<SiteDTO>>> GetAllSites()
        {
            try
            {
                var sites = await _siteService.GetAllSites();
                var siteResources = _mapper.Map<IEnumerable<Site>, IEnumerable<SiteDTO>>(sites);
                return Json(new {data = siteResources});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {data = false});
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateSite(SiteDTO model)
        {
            try
            {
                var validator = new SaveSiteResourceValidator();
                var validationResult = await validator.ValidateAsync(model);
                if (!validationResult.IsValid)
                    return BadRequest(validationResult.Errors);
                if (!UrlChecker.CheckUrl(model.Url))
                    return Json(new {success = false, msg = "Incorrect Url format."});

                if (model.IntervalTime < 30)
                    return Json(new {success = false, msg = "The Interval Time must be greater or equal 30 seconds."});

                foreach (var item in model.SiteEmails)
                    if (!EmailChecker.IsValidEmail(item.Email))
                        return Json(new {success = false, msg = "Incorrect email format!"});

                var siteToCreate = _mapper.Map<SiteDTO, Site>(model);
                var siteChecked = _siteService.GetSiteByUrl(siteToCreate);
                if(siteChecked.Result!=null)
                    return Json(new { success = false, msg = "The Url as already added!" });
                var newSite = await _siteService.CreateSite(siteToCreate);
                if (newSite != null)
                    return Json(new {success = true, msg = "The site was added."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return Json(new {success = false, msg = "Error"});
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSite(int id)
        {
            try
            {
                if (id <= 0)
                    return Json(new {success = false, msg = "The site was not found!"});
                var site = await _siteService.GetSiteById(id);
                if (site == null)
                    return Json(new {success = false, msg = "The site was not found!"});
                await _siteService.DeleteSite(site);
                return Json(new {success = true, msg = "The site was deleted."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {success = false, msg = "An error occurred."});
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetSiteEmails(int id)
        {
            try
            {
                if (id == 0)
                    return BadRequest();
                var siteEmails = await _siteEmailService.GetSiteEmailsBySiteId(id);
                var siteEmailDTO = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
                if (siteEmailDTO != null)
                    return Json(new {data = siteEmailDTO, success = true});
                return Json(new {success = false});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {success = false});
            }
        }

        [HttpPut]
        public async Task<ActionResult<SiteDTO>> UpdateSite(SiteDTO model)
        {
            try
            {
                if (model.Id <= 0)
                    return Json(new {success = true, msg = "Please select a site!"});

                if (!UrlChecker.CheckUrl(model.Url))
                    return Json(new {data = false, msg = "Incorrect Url format."});

                if (model.IntervalTime < 30)
                    return Json(new {success = false, msg = "The Interval Time must be greater or equal 30 seconds."});

                var siteToBeUpdated = await _siteService.GetSiteById(model.Id);
                if (siteToBeUpdated == null)
                    return Json(new {success = false, msg = "Site was not found!"});

                var site = _mapper.Map<SiteDTO, Site>(model);
                await _siteService.UpdateSite(siteToBeUpdated, site);
                return Json(new {success = true, msg = "The site was updated successfully."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {success = true, msg = ex.Message});
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddSiteEmail(SiteEmailDTO model)
        {
            try
            {
                if (model.SiteId <= 0)
                    return Json(new {success = false, msg = "Site was not found!"});

                if (!EmailChecker.IsValidEmail(model.Email))
                    return Json(new {success = false, msg = "Incorrect email format!"});

                var siteEmailToCreate = _mapper.Map<SiteEmailDTO, SiteEmail>(model);
                var result = _siteEmailService.GetAllSiteEmailByEmail(siteEmailToCreate);
                if (result.Result.Count() > 0)
                    return Json(new {success = false, msg = "The email was already added!"});

                var newSiteEmail = await _siteEmailService.CreateSiteEmail(siteEmailToCreate);
                if (newSiteEmail != null)
                    return Json(new {success = true, msg = "The email was added successfully."});
                return Json(new {success = false, msg = "An error occurred."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {success = false, msg = "An error occurred."});
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSiteEmail(int id)
        {
            try
            {
                if (id <= 0)
                    return Json(new {success = false, msg = "Site email was not found!"});
                var siteEmail = await _siteEmailService.GetSiteEmailById(id);
                if (siteEmail == null)
                    return NotFound();
                await _siteEmailService.DeleteSiteEmail(siteEmail);
                return Json(new {success = true, msg = "The site email was deleted."});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {success = false, msg = "An error occurred."});
            }
        }
    }
}