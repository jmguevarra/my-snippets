$(document).ready(() => {
  const getContacts = async function(){
    try {
      const response = await fetch('/_hcms/api/contacts/getall');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contacts = await response.json();
      const dtTable = $('#dtTable-Contact');
      if(contacts.length > 1){
        contacts.forEach((contact, i)=> {
          const programs = contact.bnts_program_interest ? contact.bnts_program_interest.split(";") : [];
          const programsNode = document.createElement('div');
          programsNode.classList.add('program-interests');
          programs.forEach((e) => {
            programsNode.insertAdjacentHTML('beforeend', `<span class="choice-value">${e}</span>`);
          });
          const bookingDates = `${contact.preferred_booking_date1}, ${contact.preferred_booking_date2}, ${contact.preferred_booking_date3}`;
                
          const trRow = `<tr class="contact-properties contact-property-${i}">
            <td class="contact-property crmid">${contact.id}</td>
            <td class="contact-property firstname">${contact.firstname}</td>
            <td class="contact-property lastname">${contact.lastname}</td>
            <td class="contact-property email">${contact.email}</td>
            <td class="contact-property mobilephone">${contact.mobilephone}</td>
            <td class="contact-property school">${contact.bnts_school}</td>
            <td class="contact-property teacher_requirement">${contact.teachers_requirements}</td>
            <td class="contact-property program_interests"></td>          
            <td class="contact-property preferred_booking_dates">
              <ul class="list-dates">
                <li>${contact.preferred_booking_date1}</li>
                <li>${contact.preferred_booking_date2}</li>
                <li>${contact.preferred_booking_date3}</li>
              </ul>             
            </td>
            <td class="contact-property actions">
            <div class="d-flex justify-content-center">
            <a class="btn btn-primary btn-consult small" target="_blank" href="/consultation?learning_experience_remote_virtual=${contact.learning_experience_remote_virtual}&learning_experience_future_inquiries=${contact.learning_experience_future_inquiries}&learning_experience_tech_tasters=${contact.learning_experience_tech_tasters}&other_interest=${contact.other_interest}&preferred_booking_dates=${bookingDates}&bkpros_start_date=${contact.booking_startdate}&bkpros_end_date=${contact.booking_enddate}&bnts_program_interest=${contact.bnts_program_interest}&bkcons_teacher_requirement=${contact.teachers_requirements}&firstname=${contact.firstname}&lastname=${contact.lastname}&email=${contact.email}&mobilephone=${contact.mobilephone}&bkcons_location_site=${contact.preferred_learning_location}&bnts_school=${contact.bnts_school}">Consult</a>
            </div>
                </td>
          </tr>`;
          dtTable.find('tbody').append(trRow);
          
           $(`.contact-property-${i} td.program_interests`).append(programsNode);
        });
      }else{
        const trRow = `
          <tr>
             <td class="contact-property nodata" colspan="8">No Data Found</td>
          </tr>
        `;
        dtTable.find('tbody').append(trRow);
      }
      const dtTableInit = dtTable.DataTable({
        dom: ``,
        order: [[0, 'desc']] 
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  getContacts();
});
