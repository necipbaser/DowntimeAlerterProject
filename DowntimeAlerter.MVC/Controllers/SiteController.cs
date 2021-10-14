using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using AutoMapper;
using DowntimeAlerter.MVC.Validators;
using DowntimeAlerter.MVC.ActionFilters;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class SiteController : Controller 
    {
        private readonly ILogger<SiteController> _logger;
        private readonly ISiteService _siteService;
        private readonly ISiteEmailService _siteEmailService;
        private readonly IMapper _mapper; 


        public SiteController(ISiteService siteService, ISiteEmailService siteEmailService, IMapper mapper, ILogger<SiteController> logger)
        {
            this._mapper = mapper;
            this._siteService = siteService;
            this._siteEmailService = siteEmailService;
            this._logger = logger;
        }

        public IActionResult Index()
        {
            _logger.LogInformation("Test");
            return View();
        }

        #region Site

        //site/GetAllSites
        [HttpPost]
        public async Task<ActionResult<IEnumerable<SiteDTO>>> GetAllSites()
        {
            try
            {
                var sites = await _siteService.GetAllSites();
                var siteResources = _mapper.Map<IEnumerable<Site>, IEnumerable<SiteDTO>>(sites);
                return Json(new { data = siteResources });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new { data = false });
            }
        }

        public IActionResult AddSite()
        {
            return View();
        }

        public async Task<IActionResult> EditSite(int id)
        {
            if (id == 0)
                return BadRequest();
            
            var site = await _siteService.GetSiteById(id);
            
            if (site == null)
            {
                return NotFound();
            }

            var siteEmails = await _siteEmailService.GetSiteEmailsBySiteId(id);
            var siteDTO = _mapper.Map<Site, SiteDTO>(site);
            var siteEmailDTO = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
            siteDTO.SiteEmails = siteEmailDTO;
           
            return View(siteDTO);
        }

        [HttpPost]
        public async Task<ActionResult> CreateSite(SiteDTO model)
        {
            var validator = new SaveSiteResourceValidator();
            var validationResult = await validator.ValidateAsync(model);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            //create site and siteemails
            var siteToCreate = _mapper.Map<SiteDTO, Site>(model);
            var newSite = await _siteService.CreateSite(siteToCreate);
            if (newSite != null)
                return Json(new { data = true, msg = "The site was added." });
            else
                return Json(new { data = false, msg = "Error" });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSite(int id)
        {
            if (id == 0)
                return BadRequest();
            var site = await _siteService.GetSiteById(id);
            if (site == null)
                return NotFound();
            await _siteService.DeleteSite(site);
            return Json(new { data = true, msg = "The site was deleted." });
        }
        #endregion

        #region Site Emails
        [HttpPost]
        public async Task<ActionResult> GetSiteEmails(int id)
        {
            if (id == 0)
                return BadRequest();
            var siteEmails = await _siteEmailService.GetSiteEmailsBySiteId(id);
            var siteEmailDTO = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
            if (siteEmailDTO != null)
                return Json(new { data = siteEmailDTO, success = true });
            else
                return Json(new { success = true });
        }

        [HttpPut]
        public async Task<ActionResult<SiteDTO>> UpdateSite(SiteDTO model)
        {
            if (model.Id == 0)
                return Json(new { success = true, msg = "Please select a site!" });

            var siteToBeUpdated = await _siteService.GetSiteById(model.Id);
            if (siteToBeUpdated == null)
                return Json(new { success = false, msg = "Site was not found!" });

            var site = _mapper.Map<SiteDTO, Site>(model);

            try
            {
                await _siteService.UpdateSite(siteToBeUpdated, site);
                return Json(new { success = true, msg = "The site was updated successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, msg = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddSiteEmail(SiteEmailDTO model)
        {
           if(model.SiteId==0)
                return Json(new { success = false, msg = "Site was not found!" });

            //map
            var siteEmailToCreate = _mapper.Map<SiteEmailDTO, SiteEmail>(model);

            //check email is already added
            var result = _siteEmailService.GetAllSiteEmailByEmail(siteEmailToCreate);
            if(result.Result.Count()>0)
                return Json(new { success = false, msg = "The email was already added!" });

            var newSiteEmail = await _siteEmailService.CreateSiteEmail(siteEmailToCreate);
            if (newSiteEmail != null)
                return Json(new { success = true, msg = "The email was added successfully." });
            else
                return Json(new { success = false, msg = "Error" });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSiteEmail(int id)
        {
            if (id == 0)
                return Json(new { success = false, msg = "Site email was not found!" });
            var siteEmail = await _siteEmailService.GetSiteEmailById(id);
            if (siteEmail == null)
                return NotFound();
            await _siteEmailService.DeleteSiteEmail(siteEmail);
            return Json(new { data = true, msg = "The site email was deleted." });
        }
        #endregion
    }
}
