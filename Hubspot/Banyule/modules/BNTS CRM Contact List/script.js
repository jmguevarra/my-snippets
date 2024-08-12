$(document).ready(() => {
  const getContacts = async function(){
    try {
      const response = await fetch("https://mp.kongo.melbourne/_hcms/api/contacts/getall");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contacts = await response.json();
      const dtTable = $('#dtTable-Contact');
      if(contacts.length > 1){
        contacts.forEach((contact, i)=> {
          const trRow = `<tr>
            <td class="contact-property crmid">${contact.id}</td>
            <td class="contact-property firstname">${contact.firstname}</td>
            <td class="contact-property lastname">${contact.lastname}</td>
            <td class="contact-property email">${contact.email}</td>
            <td class="contact-property mobilephone">${contact.mobilephone}</td>
            <td class="contact-property school">${contact.bnts_school}</td>
            <td class="contact-property actions">
            <div class="d-flex justify-content-center">
            <a class="btn btn-primary btn-consult small" href="/consultation?firstname=${contact.firstname}&lastname=${contact.lastname}&email=${contact.email}&mobilephone=${contact.mobilephone}&bkcons_location_site=${contact.preferred_learning_location}">Consult</a>
            </div>
                </td>
          </tr>`;
          dtTable.find('tbody').append(trRow);
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
        dom: ``
      });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  getContacts();
});
