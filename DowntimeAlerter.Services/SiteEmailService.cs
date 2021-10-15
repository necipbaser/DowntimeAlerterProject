using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;

namespace DowntimeAlerter.Services
{
    public class SiteEmailService : ISiteEmailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SiteEmailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SiteEmail> CreateSiteEmail(SiteEmail newSiteEmail)
        {
            await _unitOfWork.SiteEmails.AddAsync(newSiteEmail);
            await _unitOfWork.CommitAsync();
            return newSiteEmail;
        }

        public async Task DeleteSiteEmail(SiteEmail siteEmail)
        {
            _unitOfWork.SiteEmails.Remove(siteEmail);
            await _unitOfWork.CommitAsync();
        }

        public async Task<IEnumerable<SiteEmail>> GetAllWithSite()
        {
            return await _unitOfWork.SiteEmails
                .GetAllWithSiteAsync();
        }

        public async Task<IEnumerable<SiteEmail>> GetAllSiteEmailByEmail(SiteEmail siteEmail)
        {
            return await _unitOfWork.SiteEmails.GetAllSiteEmailByEmail(siteEmail);
        }

        public async Task<SiteEmail> GetSiteEmailById(int id)
        {
            return await _unitOfWork.SiteEmails
                .GetWithSiteByIdAsync(id);
        }

        public async Task<IEnumerable<SiteEmail>> GetSiteEmailsBySiteId(int siteId)
        {
            return await _unitOfWork.SiteEmails
                .GetAllWithSiteBySiteIdAsync(siteId);
        }

        public async Task UpdateSiteEmail(SiteEmail siteEmailToBeUpdated, SiteEmail siteEmail)
        {
            siteEmailToBeUpdated.Email = siteEmail.Email;
            siteEmailToBeUpdated.SiteId = siteEmail.SiteId;

            await _unitOfWork.CommitAsync();
        }
    }
}